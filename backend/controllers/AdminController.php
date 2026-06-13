<?php

declare(strict_types=1);

final class AdminController
{
    public function __construct(
        private readonly AdminService $adminService = new AdminService(),
        private readonly SuggestionService $suggestionService = new SuggestionService(),
        private readonly ToolService $toolService = new ToolService(),
        private readonly Review $reviewModel = new Review(),
        private readonly Suggestion $suggestionModel = new Suggestion(),
        private readonly Category $categoryModel = new Category(),
        private readonly Provider $providerModel = new Provider(),
        private readonly Model $modelModel = new Model(),
        private readonly Feature $featureModel = new Feature(),
        private readonly UploadService $uploadService = new UploadService()
    ) {
    }

    public function dashboard(): array
    {
        return Response::success($this->adminService->getDashboardData());
    }

    public function users(): array
    {
        return Response::success($this->adminService->getUsers());
    }

    public function promoteUser(array $body): array
    {
        $userId = (int) ($body['id'] ?? 0);
        if ($userId <= 0) {
            return Response::error('ID invalide');
        }
        $success = $this->adminService->updateUserRole($userId, 'manager');
        return $success ? Response::success(['message' => 'Utilisateur promu']) : Response::error('Erreur');
    }

    public function demoteUser(array $body): array
    {
        $userId = (int) ($body['id'] ?? 0);
        if ($userId <= 0) {
            return Response::error('ID invalide');
        }
        $success = $this->adminService->updateUserRole($userId, 'user');
        return $success ? Response::success(['message' => 'Utilisateur rétrogradé']) : Response::error('Erreur');
    }

    public function banUser(array $body): array
    {
        $userId = (int) ($body['id'] ?? 0);
        if ($userId <= 0) {
            return Response::error('ID invalide');
        }
        $success = $this->adminService->updateUserStatus($userId, 'suspended');
        return $success ? Response::success(['message' => 'Utilisateur banni']) : Response::error('Erreur');
    }

    public function unbanUser(array $body): array
    {
        $userId = (int) ($body['id'] ?? 0);
        if ($userId <= 0) {
            return Response::error('ID invalide');
        }
        $success = $this->adminService->updateUserStatus($userId, 'active');
        return $success ? Response::success(['message' => 'Utilisateur débanni']) : Response::error('Erreur');
    }

    public function suggestions(): array
    {
        return Response::success($this->adminService->getSuggestions());
    }

    public function approveSuggestion(array $body): array
    {
        $suggestionId = (int) ($body['id'] ?? 0);
        if ($suggestionId <= 0) {
            return Response::error('ID invalide');
        }

        $adminId = 1; // Fallback to 1 if user auth isn't passed in context

        $result = $this->suggestionService->promoteToTool($suggestionId, $adminId);

        if ($result['success']) {
            return Response::success($result);
        }
        
        $errorMessage = $result['message'] ?? (isset($result['errors']) ? implode(', ', $result['errors']) : 'Erreur lors de l\'approbation');
        return Response::error($errorMessage);
    }

    public function rejectSuggestion(array $body): array
    {
        $suggestionId = (int) ($body['id'] ?? 0);
        $reason = trim((string) ($body['reason'] ?? ''));
        
        if ($suggestionId <= 0) {
            return Response::error('ID invalide');
        }
        
        $success = $this->adminService->rejectSuggestion($suggestionId, $reason);
        return $success ? Response::success(['message' => 'Suggestion rejetée']) : Response::error('Erreur');
    }

    public function deleteSuggestion(array $body): array
    {
        $suggestionId = (int) ($body['id'] ?? 0);

        if ($suggestionId <= 0) {
            return Response::error('ID invalide');
        }

        $success = $this->adminService->deleteSuggestion($suggestionId);
        return $success ? Response::success(['message' => 'Suggestion supprimée']) : Response::error('Erreur lors de la suppression');
    }

    public function createSuggestion(array $body, ?array $logoFile = null): array
    {
        $name = trim((string) ($body['name'] ?? ''));
        $categoryId = (int) ($body['category_id'] ?? 0);
        if ($name === '' || $categoryId <= 0) {
            return Response::error('Le nom et la catégorie sont obligatoires.');
        }

        $adminId = (int) ($body['user_id'] ?? 0);
        if ($adminId <= 0) {
            $adminId = 1;
        }

        $payload = [
            'user_id'              => $adminId,
            'name'                 => $name,
            'website_url'          => trim((string) ($body['website_url'] ?? '')),
            'description'          => trim((string) ($body['description'] ?? '')),
            'category_id'          => $categoryId,
            'provider_id'          => isset($body['provider_id']) && $body['provider_id'] !== '' ? (int) $body['provider_id'] : null,
            'model_id'             => isset($body['model_id']) && $body['model_id'] !== '' ? (int) $body['model_id'] : null,
            'model_ids'            => isset($body['model_ids']) && $body['model_ids'] !== '' ? $body['model_ids'] : null,
            'existing_feature_ids' => isset($body['existing_feature_ids']) && $body['existing_feature_ids'] !== ''
                ? (is_array($body['existing_feature_ids'])
                    ? json_encode(array_map('intval', $body['existing_feature_ids']))
                    : json_encode(array_map('intval', explode(',', $body['existing_feature_ids']))))
                : null,
            'release_date'         => ($body['release_date'] ?? '') !== '' ? $body['release_date'] : null,
            'why_this_tool'        => 'Ajouté par administrateur',
            'status'               => 'waiting_ai_analysis',
        ];

        $result = $this->suggestionService->createSuggestion($payload, $logoFile);

        if (($result['success'] ?? false) === false && empty($result['data'])) {
            return Response::error($result['message'] ?? 'Erreur lors de la création de la suggestion.');
        }

        return Response::success($result['data'] ?? $result);
    }

    public function updateSuggestion(array $body, ?array $logoFile = null): array
    {
        $id = (int) ($body['id'] ?? 0);
        if ($id <= 0) {
            return Response::error('ID invalide');
        }
        unset($body['id']);

        if ($logoFile && $logoFile['error'] === UPLOAD_ERR_OK) {
            $customName = trim((string) ($body['fixed_name'] ?? $body['name'] ?? ''));
            $uploadResult = $this->uploadService->handleUpload($logoFile, 'uploads/tools', $customName);
            if ($uploadResult['success']) {
                $body['logo_url'] = $uploadResult['path'];
            } else {
                error_log('AdminController::updateSuggestion upload error: ' . ($uploadResult['error'] ?? 'unknown'));
            }
        }

        $success = $this->suggestionModel->update($id, $body);
        if ($success) {
            $updated = $this->suggestionModel->findById($id);
            return Response::success($updated);
        }
        return Response::error('Erreur lors de la mise à jour');
    }

    public function suggestionHistory(): array
    {
        $adminId = 1;

        $modelsLookup = array_column($this->modelModel->all(), 'name', 'id');
        $featuresLookup = array_column($this->featureModel->all(), 'name', 'id');

        $sql = "SELECT s.*,
                       c.name AS category_name,
                       fc.name AS fixed_category_name,
                       p.name AS provider_name,
                       fp.name AS fixed_provider_name
                FROM suggestions s
                LEFT JOIN categories c ON s.category_id = c.id
                LEFT JOIN categories fc ON s.fixed_category_id = fc.id
                LEFT JOIN providers p ON s.provider_id = p.id
                LEFT JOIN providers fp ON s.fixed_provider_id = fp.id
                WHERE s.user_id = :admin_id
                ORDER BY s.created_at DESC";

        $stmt = db_connection()->prepare($sql);
        $stmt->execute([':admin_id' => $adminId]);
        $history = $stmt->fetchAll();

        $resolveIds = function (string $raw, array $lookup): array {
            if (empty($raw) || $raw === '[]') return [];
            $ids = str_starts_with(trim($raw), '[')
                ? (json_decode($raw, true) ?? [])
                : explode(',', $raw);
            return array_values(array_filter(
                array_map(fn($id) => $lookup[(int) $id] ?? null, $ids)
            ));
        };

        foreach ($history as &$s) {
            $s['model_names']         = $resolveIds($s['model_ids'] ?? '', $modelsLookup);
            $s['fixed_model_names']   = $resolveIds($s['fixed_model_ids'] ?? '', $modelsLookup);
            $s['existing_feature_names'] = $resolveIds($s['existing_feature_ids'] ?? '', $featuresLookup);
            $s['fixed_feature_names']    = $resolveIds($s['fixed_feature_ids'] ?? '', $featuresLookup);
        }

        return Response::success($history);
    }

    public function formData(): array
    {
        $categories = $this->categoryModel->all();
        $providers  = $this->providerModel->all();
        $models     = $this->modelModel->all();
        $features   = $this->featureModel->all();

        return Response::success([
            'categories' => $categories,
            'providers'  => $providers,
            'models'     => $models,
            'features'   => $features,
        ]);
    }

    public function moderationReviews(): array
    {
        $flagged = $this->reviewModel->allByStatus('flagged');
        return Response::success($flagged);
    }

    public function approveModerationReview(array $body): array
    {
        $reviewId = (int) ($body['id'] ?? 0);
        if ($reviewId <= 0) {
            return Response::error('ID invalide');
        }

        $success = $this->reviewModel->updateModeration($reviewId, 'approved', null);
        return $success ? Response::success(['message' => 'Commentaire approuvé']) : Response::error('Erreur lors de l\'approbation');
    }

    public function deleteModerationReview(array $body): array
    {
        $reviewId = (int) ($body['id'] ?? 0);
        if ($reviewId <= 0) {
            return Response::error('ID invalide');
        }

        $success = $this->reviewModel->delete($reviewId);
        return $success ? Response::success(['message' => 'Commentaire supprimé']) : Response::error('Erreur lors de la suppression');
    }

    public function tools(): array
    {
        return Response::success($this->toolService->listAllToolsWithDetails());
    }

    public function updateToolStatus(array $body): array
    {
        $toolId = (int) ($body['id'] ?? 0);
        $newStatus = trim((string) ($body['status'] ?? ''));
        if ($toolId <= 0 || $newStatus === '') {
            return Response::error('Paramètres invalides');
        }
        $result = $this->toolService->updateToolStatus($toolId, $newStatus);
        return $result['success'] ? Response::success(['message' => 'Statut mis à jour']) : Response::error($result['error'] ?? 'Erreur');
    }

    public function deleteTool(array $body): array
    {
        $toolId = (int) ($body['id'] ?? 0);
        if ($toolId <= 0) {
            return Response::error('ID invalide');
        }
        $result = $this->toolService->deleteTool($toolId);
        return $result['success'] ? Response::success(['message' => 'Outil supprimé']) : Response::error($result['error'] ?? 'Erreur');
    }

    // ── Categories ────────────────────────────────────────────

    public function createCategory(array $body): array
    {
        $name = trim((string) ($body['name'] ?? ''));
        if ($name === '') {
            return Response::error('Le nom est obligatoire.');
        }
        $id = $this->categoryModel->create([
            'name'        => $name,
            'icon'        => $body['icon'] ?? null,
            'description' => $body['description'] ?? null,
        ]);
        return Response::success(['id' => $id, 'message' => 'Catégorie créée']);
    }

    public function updateCategory(array $body): array
    {
        $id = (int) ($body['id'] ?? 0);
        if ($id <= 0) {
            return Response::error('ID invalide');
        }
        $updated = $this->categoryModel->update($id, $body);
        return $updated ? Response::success(['message' => 'Catégorie mise à jour']) : Response::error('Erreur lors de la mise à jour');
    }

    public function deleteCategory(array $body): array
    {
        $id = (int) ($body['id'] ?? 0);
        if ($id <= 0) {
            return Response::error('ID invalide');
        }
        $deleted = $this->categoryModel->delete($id);
        return $deleted ? Response::success(['message' => 'Catégorie supprimée']) : Response::error('Erreur lors de la suppression');
    }

    // ── Providers ─────────────────────────────────────────────

    public function createProvider(array $body): array
    {
        $name = trim((string) ($body['name'] ?? ''));
        if ($name === '') {
            return Response::error('Le nom est obligatoire.');
        }
        $id = $this->providerModel->create([
            'name'        => $name,
            'website_url' => $body['website_url'] ?? null,
            'description' => $body['description'] ?? null,
            'status'      => $body['status'] ?? 'pending',
        ]);
        return Response::success(['id' => $id, 'message' => 'Fournisseur créé']);
    }

    public function updateProvider(array $body): array
    {
        $id = (int) ($body['id'] ?? 0);
        if ($id <= 0) {
            return Response::error('ID invalide');
        }
        $updated = $this->providerModel->update($id, $body);
        return $updated ? Response::success(['message' => 'Fournisseur mis à jour']) : Response::error('Erreur lors de la mise à jour');
    }

    public function deleteProvider(array $body): array
    {
        $id = (int) ($body['id'] ?? 0);
        if ($id <= 0) {
            return Response::error('ID invalide');
        }
        $deleted = $this->providerModel->delete($id);
        return $deleted ? Response::success(['message' => 'Fournisseur supprimé']) : Response::error('Erreur lors de la suppression');
    }

    // ── Features ──────────────────────────────────────────────

    public function createFeature(array $body): array
    {
        $name = trim((string) ($body['name'] ?? ''));
        if ($name === '') {
            return Response::error('Le nom est obligatoire.');
        }
        $id = $this->featureModel->create([
            'name'        => $name,
            'description' => $body['description'] ?? null,
            'type'        => $body['type'] ?? null,
            'status'      => $body['status'] ?? 'active',
        ]);
        return Response::success(['id' => $id, 'message' => 'Fonctionnalité créée']);
    }

    public function updateFeature(array $body): array
    {
        $id = (int) ($body['id'] ?? 0);
        if ($id <= 0) {
            return Response::error('ID invalide');
        }
        $updated = $this->featureModel->update($id, $body);
        return $updated ? Response::success(['message' => 'Fonctionnalité mise à jour']) : Response::error('Erreur lors de la mise à jour');
    }

    public function deleteFeature(array $body): array
    {
        $id = (int) ($body['id'] ?? 0);
        if ($id <= 0) {
            return Response::error('ID invalide');
        }
        $deleted = $this->featureModel->delete($id);
        return $deleted ? Response::success(['message' => 'Fonctionnalité supprimée']) : Response::error('Erreur lors de la suppression');
    }

    // ── Models ────────────────────────────────────────────────

    public function createModel(array $body): array
    {
        $name = trim((string) ($body['name'] ?? ''));
        $providerId = (int) ($body['provider_id'] ?? 0);
        if ($name === '' || $providerId <= 0) {
            return Response::error('Le nom et le fournisseur sont obligatoires.');
        }
        $id = $this->modelModel->create([
            'provider_id'  => $providerId,
            'name'         => $name,
            'description'  => $body['description'] ?? null,
            'status'       => $body['status'] ?? 'active',
        ]);
        return Response::success(['id' => $id, 'message' => 'Modèle créé']);
    }

    public function updateModel(array $body): array
    {
        $id = (int) ($body['id'] ?? 0);
        if ($id <= 0) {
            return Response::error('ID invalide');
        }
        $updated = $this->modelModel->update($id, $body);
        return $updated ? Response::success(['message' => 'Modèle mis à jour']) : Response::error('Erreur lors de la mise à jour');
    }

    public function deleteModel(array $body): array
    {
        $id = (int) ($body['id'] ?? 0);
        if ($id <= 0) {
            return Response::error('ID invalide');
        }
        $deleted = $this->modelModel->delete($id);
        return $deleted ? Response::success(['message' => 'Modèle supprimé']) : Response::error('Erreur lors de la suppression');
    }
}
