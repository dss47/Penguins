<?php

declare(strict_types=1);

final class SuggestionService
{
    /**
     * Traite la soumission du formulaire, l'enregistre, l'envoie à l'IA, 
     * et met à jour la base de données avec le verdict.
     */
    public function __construct(
        private readonly Suggestion $suggestionModel = new Suggestion(),
        private readonly OpenRouterService $openRouterService = new OpenRouterService(), // Nom mis à jour
        private readonly Category $categoryModel = new Category(),
        private readonly Provider $providerModel = new Provider(),
        private readonly AiModel $modelModel = new AiModel(),
        private readonly Feature $featureModel = new Feature(),
        private readonly ToolService $toolService = new ToolService(),
        private readonly UploadService $uploadService = new UploadService()
    ) {
    }

    public function createSuggestion(array $payload, ?array $file = null): array
    {
        // 0. Handle logo upload if present
        if ($file && $file['error'] !== UPLOAD_ERR_NO_FILE) {
            $uploadResult = $this->uploadService->handleUpload($file, 'uploads/tools');
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
        $suggestionId = $this->suggestionModel->create($payload);

        // 2. Préparation du contexte "Slim"
        $slimContext = $this->buildSlimDatabaseContext();

        // 3. Appel de l'IA (Correction ici ! 👇)
        $aiResponseJson = $this->openRouterService->evaluateToolSubmission($payload, $slimContext);

        // 4. Traitement de la réponse de l'IA
        if ($aiResponseJson) {
            $aiData = json_decode($aiResponseJson, true);
            
            if (isset($aiData['status'])) {
                $this->suggestionModel->updateFromAiValidation($suggestionId, $aiData);
                $updatedSuggestion = $this->suggestionModel->findById($suggestionId);
                
                return [
                    'success' => true,
                    'message' => 'Validation IA terminée.',
                    'data'    => $updatedSuggestion
                ];
            }
        }

        // 5. FALLBACK
        $this->suggestionModel->updateStatus($suggestionId, 'pending_manager', 'Erreur API IA. Validation manuelle requise.');
        $fallbackSuggestion = $this->suggestionModel->findById($suggestionId);

        return [
            'success' => false,
            'message' => 'L\'IA n\'a pas pu valider l\'outil. Transféré à l\'équipe de modération.',
            'data'    => $fallbackSuggestion
        ];
    }
    /**
     * Récupère toutes les suggestions en attente de validation par un manager
     * (Ce qui inclut les soumissions "approuvées" par l'IA mais qui attendent 
     * le clic final de l'admin, ou celles tombées en fallback).
     */
    public function listPendingSuggestions(): array
    {
        return array_merge(
            $this->suggestionModel->allByStatus('approved'), // IA a dit oui, attend l'admin
            $this->suggestionModel->allByStatus('pending_manager') // Mode Fallback
        );
    }

    /**
     * Promeut une suggestion approuvée vers la table ai_tools principale.
     */
    public function promoteToTool(int $suggestionId, int $adminId): array
    {
        $suggestion = $this->suggestionModel->findById($suggestionId);
        if (!$suggestion) {
            return ['success' => false, 'message' => 'Suggestion introuvable'];
        }

        // On utilise les ID corrigés par l'IA s'ils existent, sinon ceux suggérés
        $toolPayload = [
            'name' => $suggestion['name'],
            'category_id' => $suggestion['ai_category_id'] ?? $suggestion['category_id'],
            'provider_id' => $suggestion['ai_provider_id'] ?? $suggestion['provider_id'],
            'website_url' => $suggestion['website_url'],
            'logo_url' => $suggestion['logo_url'] ?? null,
            'description' => $suggestion['description'] ?? null,
            'status' => 'active'
        ];

        $result = $this->toolService->createTool($toolPayload, $adminId);

        if ($result['success']) {
            $this->suggestionModel->updateStatus($suggestionId, 'completed', 'Ajouté aux outils avec succès.');
            // Option C: Update suggestion with the new tool_id if the column exists
            // e.g., $this->suggestionModel->updateToolId($suggestionId, $result['id']);
            return ['success' => true, 'tool_id' => $result['id']];
        }

        return ['success' => false, 'errors' => $result['errors'] ?? ['Erreur lors de la création de l\'outil']];
    }

    /**
     * Génère des listes optimisées [ID => Nom] pour ne pas gaspiller
     * de tokens lors de l'appel à l'API OpenRouter.
     */
    private function buildSlimDatabaseContext(): array
    {
        // Note: Remplacez ces appels par la vraie méthode de vos modèles
        // qui retourne les données. Ex: $this->categoryModel->all();
        $rawCategories = $this->categoryModel->all();
        $rawProviders  = $this->providerModel->all();
        $rawModels     = $this->modelModel->all();
        $rawFeatures   = $this->featureModel->all();

        // Fonction utilitaire pour transformer un tableau complet en [id => name]
        $formatter = fn($array) => array_column($array, 'name', 'id');

        return [
            'categories' => $formatter($rawCategories),
            'providers'  => $formatter($rawProviders),
            'models'     => $formatter($rawModels),
            'features'   => $formatter($rawFeatures),
        ];
    }
}