<?php

declare(strict_types=1);

final class SuggestionService
{
    // Handles form submission, saves it, sends it to the AI, and updates the database with the verdict
    public function __construct(
        private readonly Suggestion $suggestionModel = new Suggestion(),
        private readonly OpenRouterService $openRouterService = new OpenRouterService(),
        private readonly Category $categoryModel = new Category(),
        private readonly Provider $providerModel = new Provider(),
        private readonly Model $modelModel = new Model(),
        private readonly Feature $featureModel = new Feature(),
        private readonly ToolService $toolService = new ToolService(),
        private readonly UploadService $uploadService = new UploadService(),
        private readonly ToolModel $toolModelJunction = new ToolModel(),
        private readonly ToolFeatures $toolFeatures = new ToolFeatures()
    ) {
    }

    // Creates a suggestion, uploads a logo if provided, sends it to AI for evaluation, and returns the result
    public function createSuggestion(array $payload, ?array $file = null): array
    {
        // Handles logo upload if present
        if ($file && $file['error'] !== UPLOAD_ERR_NO_FILE) {
            $uploadResult = $this->uploadService->handleUpload($file, 'uploads/tools', $payload['name'] ?? null);
            if (!$uploadResult['success']) {
                return [
                    'success' => false,
                    'message' => $uploadResult['error'],
                    'data'    => null
                ];
            }
            $payload['logo_url'] = $uploadResult['path'];
        }

        // 1. Sauvegarde initiale
        try {
            $suggestionId = $this->suggestionModel->create($payload);
        } catch (PDOException $e) {
            return [
                'success' => false,
                'message' => 'Erreur base de données : ' . $e->getMessage(),
                'data'    => null,
            ];
        }

        $slimContext = $this->buildSlimDatabaseContext();

        $aiResponseJson = $this->openRouterService->evaluateToolSubmission($payload, $slimContext);

        if ($aiResponseJson) {
            $aiData = json_decode($aiResponseJson, true);

            if (json_last_error() === JSON_ERROR_NONE && is_array($aiData) && isset($aiData['status'])) {
                $this->suggestionModel->updateFromAiValidation($suggestionId, $aiData);
                $updatedSuggestion = $this->suggestionModel->findById($suggestionId);
                
                return [
                    'success' => true,
                    'message' => 'Validation IA terminée.',
                    'data'    => $updatedSuggestion
                ];
            }

            error_log('SuggestionService::createSuggestion invalid AI JSON: ' . json_last_error_msg() . ' | Response: ' . substr($aiResponseJson, 0, 500));
        }

        $this->suggestionModel->updateStatus($suggestionId, 'waiting_manual_validation', 'Erreur API IA. Validation manuelle requise.');
        $fallbackSuggestion = $this->suggestionModel->findById($suggestionId);

        return [
            'success' => true,
            'message' => 'Suggestion enregistrée. L\'IA n\'a pas pu valider l\'outil, validation manuelle requise.',
            'data'    => $fallbackSuggestion
        ];
    }
    // Returns all suggestions awaiting manager validation (AI-approved or fallback)
    public function listPendingSuggestions(): array
    {
        return array_merge(
            $this->suggestionModel->allByStatus('ai_approved_pending_review'), // IA a dit oui, attend l'admin
            $this->suggestionModel->allByStatus('waiting_manual_validation') // Mode Fallback
        );
    }

    // Promotes an approved suggestion into the main ai_tools table
    public function promoteToTool(int $suggestionId, int $adminId): array
    {
        $suggestion = $this->suggestionModel->findById($suggestionId);
        if (!$suggestion) {
            return ['success' => false, 'message' => 'Suggestion introuvable'];
        }

        $toolPayload = [
            'name' => $suggestion['fixed_name'] ?? $suggestion['name'],
            'category_id' => $suggestion['fixed_category_id'] ?? $suggestion['category_id'],
            'provider_id' => $suggestion['fixed_provider_id'] ?? $suggestion['provider_id'],
            'website_url' => $suggestion['fixed_url'] ?? $suggestion['website_url'],
            'logo_url' => $suggestion['logo_url'] ?? null,
            'description' => $suggestion['description'] ?? null,
            'release_date' => $suggestion['fixed_release_date'] ?? $suggestion['release_date'] ?? null,
            'validated_by' => $adminId,
            'global_rating' => $suggestion['ai_global_rating'] ?? null,
            'status' => 'active'
        ];

        $result = $this->toolService->createTool($toolPayload, $adminId);

        if ($result['success']) {
            $toolId = $result['id'];

            // Link models via junction table (handle multiple models from model_ids / fixed_model_ids)
            $modelIdsRaw = $suggestion['fixed_model_ids'] ?? $suggestion['model_ids'] ?? null;
            if ($modelIdsRaw) {
                $ids = is_array($modelIdsRaw) ? $modelIdsRaw : (
                    str_starts_with($modelIdsRaw, '[') ? (json_decode($modelIdsRaw, true) ?? []) : explode(',', $modelIdsRaw)
                );
                foreach (array_map('intval', $ids) as $mid) {
                    if ($mid > 0) $this->toolModelJunction->linkModelToTool($toolId, $mid);
                }
            } else {
                // Fallback to single model_id
                $modelId = $suggestion['fixed_model_id'] ?? $suggestion['model_id'] ?? null;
                if ($modelId) {
                    $this->toolModelJunction->linkModelToTool($toolId, (int) $modelId);
                }
            }

            // Link features via junction table (handle JSON or comma-separated)
            $featureIds = $suggestion['fixed_feature_ids'] ?? $suggestion['existing_feature_ids'] ?? null;
            if ($featureIds) {
                $ids = is_array($featureIds) ? $featureIds : (
                    str_starts_with($featureIds, '[') ? (json_decode($featureIds, true) ?? []) : explode(',', $featureIds)
                );
                foreach (array_map('intval', $ids) as $fid) {
                    if ($fid > 0) $this->toolFeatures->linkFeatureToTool($toolId, $fid);
                }
            }

            $this->suggestionModel->updateStatus($suggestionId, 'published_to_catalog', null, $toolId);
            return ['success' => true, 'tool_id' => $toolId];
        }

        return ['success' => false, 'errors' => $result['errors'] ?? ['Erreur lors de la création de l\'outil']];
    }

    // Builds slim [ID => Name] lists to minimize token usage in the OpenRouter API call
    private function buildSlimDatabaseContext(): array
    {
        $rawCategories = $this->categoryModel->all();
        $rawProviders  = $this->providerModel->all();
        $rawModels     = $this->modelModel->all();
        $rawFeatures   = $this->featureModel->all();
        $rawTools      = $this->toolService->listTools();

        $formatter = fn($array) => array_column($array, 'name', 'id');

        return [
            'categories' => $formatter($rawCategories),
            'providers'  => $formatter($rawProviders),
            'models'     => $formatter($rawModels),
            'features'   => $formatter($rawFeatures),
            'tools'      => array_column($rawTools ?: [], 'name'),
        ];
    }
}
