<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Services\SuggestionService;
use App\Models\Suggestion;
use App\Models\Category;
use App\Models\Provider;
use App\Models\Model;
use App\Models\Feature;
use App\Middleware\AuthMiddleware;
use App\Utils\Response;



final class SuggestionController
{
    public function __construct(
        private readonly SuggestionService $suggestionService = new SuggestionService(),
        private readonly Suggestion $suggestionModel = new Suggestion(),
        private readonly Category $categoryModel = new Category(),
        private readonly Provider $providerModel = new Provider(),
        private readonly Model $modelModel = new Model(),
        private readonly Feature $featureModel = new Feature(),
        private readonly AuthMiddleware $authMiddleware = new AuthMiddleware()
    ) {
    }

    // Authenticates the user via JWT and returns the user ID
    private function getUserId(): ?int
    {
        $user = $this->authMiddleware->authenticate();
        return $user ? (int) ($user['user_id'] ?? 0) : null;
    }

    // Creates a new suggestion with optional logo upload
    public function create(array $body, ?array $logoFile = null): array
    {
        $userId = $this->getUserId();
        if (!$userId) {
            return Response::error('Non authentifié', 401);
        }

        $name = trim((string) ($body['name'] ?? ''));
        $categoryId = (int) ($body['category_id'] ?? 0);
        if ($name === '' || $categoryId <= 0) {
            return Response::error('Le nom et la catégorie sont obligatoires.');
        }

        $payload = [
            'user_id'              => $userId,
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
            'why_this_tool'        => trim((string) ($body['why_this_tool'] ?? 'Soumis par l\'utilisateur')),
            'status'               => 'waiting_ai_analysis',
        ];

        $result = $this->suggestionService->createSuggestion($payload, $logoFile);

        if (($result['success'] ?? false) === false && empty($result['data'])) {
            return Response::error($result['message'] ?? 'Erreur lors de la création de la suggestion.');
        }

        return Response::success($result['data'] ?? $result);
    }

    // Returns the authenticated user's suggestion history with resolved names
    public function history(): array
    {
        $userId = $this->getUserId();
        if (!$userId) {
            return Response::error('Non authentifié', 401);
        }

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
                WHERE s.user_id = :user_id
                ORDER BY s.created_at DESC";

        $stmt = db_connection()->prepare($sql);
        $stmt->execute([':user_id' => $userId]);
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
}
