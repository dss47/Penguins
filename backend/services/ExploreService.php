<?php

declare(strict_types=1);

final class ExploreService
{
    public function __construct(
        private readonly AiTool $toolModel = new AiTool(),
        private readonly OpenRouterService $openRouterService = new OpenRouterService(),
        private readonly SearchHistoryService $searchHistoryService = new SearchHistoryService(),
        private readonly AuthMiddleware $authMiddleware = new AuthMiddleware(),
        private readonly ToolService $toolService = new ToolService()
    ) {
    }

    // Returns data for the home page: latest, featured, and trending tools
    public function home(): array
    {
        return [
            'latest'   => $this->toolModel->getLatestTools(6),
            'featured' => $this->toolModel->getFeaturedTools(6),
            'trending' => $this->toolModel->getTrendingTools(6)
        ];
    }

    // Returns landing page stats: tool count, category count, community members, and top categories
    public function landingSummary(): array
    {
        $db = db_connection();

        $categoriesStmt = $db->prepare('SELECT id, name, icon FROM categories ORDER BY name ASC LIMIT 6');
        $categoriesStmt->execute();

        return [
            'tool_count' => (int) $db->query("SELECT COUNT(*) FROM ai_tools WHERE status = 'active'")->fetchColumn(),
            'category_count' => (int) $db->query('SELECT COUNT(*) FROM categories')->fetchColumn(),
            'community_members' => (int) $db->query("SELECT COUNT(*) FROM users WHERE role <> 'admin' AND status <> 'deleted'")->fetchColumn(),
            'categories' => $categoriesStmt->fetchAll(PDO::FETCH_ASSOC) ?: [],
        ];
    }

    // Searches tools by keywords using SQL LIKE / full-text search
    public function searchByKeywords(string $query): array
    {
        $cleanQuery = trim($query);
        
        if (empty($cleanQuery)) {
            return [];
        }

        return $this->toolModel->searchByKeywords($cleanQuery);
    }

    // Performs an AI-powered search: user describes a problem, AI recommends matching tools
    public function searchByPrompt(string $prompt, ?int $userId = null): array
    {
        $cleanPrompt = trim($prompt);
        if ($cleanPrompt === '') {
            return [
                'success' => false,
                'message' => "Votre requête ne peut pas être vide."
            ];
        }

        $candidates = $this->toolModel->recommendationCandidates();
        if (empty($candidates)) {
            return [
                'success' => false,
                'message' => "Aucun outil actif disponible pour la recommandation."
            ];
        }

        $aiAnswer = $this->openRouterService->getRecommendations($cleanPrompt, $candidates);

        if (!$aiAnswer) {
            return [
                'success' => false,
                'message' => "L'IA est actuellement indisponible. Veuillez réessayer plus tard."
            ];
        }

        $candidateIds = array_map('intval', array_column($candidates, 'id'));
        $selectedIds = array_values(array_slice(array_filter(
            array_map('intval', $aiAnswer['tool_ids'] ?? []),
            fn($id) => in_array($id, $candidateIds, true)
        ), 0, 6));

        $tools = $this->toolModel->findActiveByIds($selectedIds);
        $toolFeatures = new ToolFeatures();
        foreach ($tools as &$tool) {
            $features = $toolFeatures->findFeaturesByToolId((int) $tool['id']);
            $tool['features'] = array_column($features, 'name');
        }
        unset($tool);

        $title = trim((string) ($aiAnswer['title'] ?? ''));
        if ($title === '') {
            $title = substr($cleanPrompt, 0, 60);
        }
        $title = substr($title, 0, 60);
        $reasoning = trim((string) ($aiAnswer['reasoning'] ?? ''));

        $historyId = null;
        if ($userId && $userId > 0) {
            $history = $this->searchHistoryService->logSearch($userId, $cleanPrompt, $reasoning, $selectedIds, $title);
            if (($history['success'] ?? false) && isset($history['search_id'])) {
                $historyId = (int) $history['search_id'];
            }
        }

        return [
            'success' => true,
            'data' => [
                'history_id' => $historyId,
                'prompt' => $cleanPrompt,
                'title' => $title,
                'reasoning' => $reasoning,
                'tool_ids' => $selectedIds,
                'tools' => $tools
            ]
        ];
    }

    // Filters tools by category and/or provider for the Explore page
    public function filterTools(?int $categoryId = null, ?int $providerId = null): array
    {
        if ($categoryId === null && $providerId === null) {
            return $this->toolModel->all();
        }

        return $this->toolModel->filter($categoryId, $providerId);
    }

    // Returns full tool details including similar tools from the same category
    public function getToolDetails(int $toolId): ?array
    {
        if ($toolId <= 0) {
            return null;
        }

        $tool = $this->toolModel->findByIdWithDetails($toolId);

        if (!$tool) {
            return null;
        }

        $tool['similar_tools'] = $this->toolModel->getSimilarTools($tool['category_id'], $toolId, 3);

        return $tool;
    }
}
