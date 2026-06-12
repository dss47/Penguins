<?php

declare(strict_types=1);

final class AdminController
{
    public function __construct(
        private readonly AdminService $adminService = new AdminService(),
        private readonly SuggestionService $suggestionService = new SuggestionService(),
        private readonly Review $reviewModel = new Review(),
        private readonly Suggestion $suggestionModel = new Suggestion(),
        private readonly Category $categoryModel = new Category(),
        private readonly Provider $providerModel = new Provider(),
        private readonly Model $modelModel = new Model(),
        private readonly Feature $featureModel = new Feature()
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

        return Response::success($result['data'] ?? $result);
    }

    public function updateSuggestion(array $body): array
    {
        $id = (int) ($body['id'] ?? 0);
        if ($id <= 0) {
            return Response::error('ID invalide');
        }
        unset($body['id']);
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
}