<?php

declare(strict_types=1);

final class SearchHistoryService
{
    public function __construct(
        private readonly SearchHistory $searchHistoryModel = new SearchHistory(),
        private readonly SearchHistoryTool $searchHistoryToolModel = new SearchHistoryTool(),
        private readonly ToolFeatures $toolFeatures = new ToolFeatures()
    ) {
    }

    // Logs a new AI-powered search into the user's history, called after ExploreService gets an OpenRouter response
    public function logSearch(int $userId, string $prompt, string $aiReasoning, array $recommendedToolIds, ?string $title = null): array
    {
        if ($userId <= 0 || empty(trim($prompt))) {
            return ['success' => false, 'message' => 'Données de recherche invalides.'];
        }

        $cleanPrompt = trim($prompt);
        $cleanTitle = trim((string) ($title ?? ''));
        if ($cleanTitle === '') {
            $cleanTitle = $cleanPrompt;
        }

        $searchId = $this->searchHistoryModel->create([
            'user_id'      => $userId,
            'prompt_text'  => $cleanPrompt,
            'search_type'  => 'ai_prompt',
            'title'        => substr($cleanTitle, 0, 60),
            'ai_reasoning' => trim($aiReasoning)
        ]);

        if ($searchId > 0 && !empty($recommendedToolIds)) {
            foreach ($recommendedToolIds as $toolId) {
                $this->searchHistoryToolModel->linkTool($searchId, (int) $toolId);
            }
        }

        return [
            'success' => true,
            'message' => 'Recherche sauvegardée dans l\'historique.',
            'search_id' => $searchId
        ];
    }

    // Retrieves the full search history for a user (for profile/dashboard)
    public function listUserHistory(int $userId): array
    {
        if ($userId <= 0) {
            return [];
        }

        return $this->searchHistoryModel->allByUserId($userId) ?: [];
    }

    // Deprecated alias for listUserHistory
    public function getUserHistory(int $userId): array
    {
        return $this->listUserHistory($userId);
    }

    // Returns details of a past search including the recommended tools, with ownership check
    public function getSearchDetails(int $searchId, int $userId): ?array
    {
        if ($searchId <= 0 || $userId <= 0) {
            return null;
        }

        $search = $this->searchHistoryModel->findById($searchId);
        
        if (!$search || (int)$search['user_id'] !== $userId) {
            return null;
        }

        $tools = $this->searchHistoryToolModel->findToolsByHistoryId($searchId);
        foreach ($tools as &$tool) {
            $features = $this->toolFeatures->findFeaturesByToolId((int) $tool['id']);
            $tool['features'] = array_column($features, 'name');
        }
        unset($tool);

        $search['tools'] = $tools;

        return $search;
    }

    // Clears all search history for a user (privacy / GDPR feature)
    public function clearUserHistory(int $userId): array
    {
        if ($userId <= 0) {
            return ['success' => false, 'message' => 'ID Utilisateur invalide.'];
        }

        $deleted = $this->searchHistoryModel->deleteAllByUserId($userId);

        return [
            'success' => $deleted,
            'message' => $deleted ? 'Historique effacé avec succès.' : 'Erreur lors de la suppression de l\'historique.'
        ];
    }
}
