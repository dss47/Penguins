<?php

declare(strict_types=1);

final class ExploreService
{
    // On injecte le Tool Model, mais aussi le OpenRouterService pour la recherche intelligente !
    public function __construct(
        private readonly AiTool $toolModel = new AiTool(),
        private readonly OpenRouterService $openRouterService = new OpenRouterService(),
        private readonly SearchHistoryService $searchHistoryService = new SearchHistoryService(),
        private readonly AuthMiddleware $authMiddleware = new AuthMiddleware(),
        private readonly ToolService $toolService = new ToolService()
    ) {
    }

    /**
     * Données pour la page d'accueil (Accueil / Dashboard Utilisateur).
     * Regroupe les nouveautés, les outils mis en avant, etc.
     */
    public function home(): array
    {
        return [
            'latest'   => $this->toolModel->getLatestTools(6),   // Les 6 derniers ajouts
            'featured' => $this->toolModel->getFeaturedTools(6), // Outils sponsorisés/populaires
            'trending' => $this->toolModel->getTrendingTools(6)  // Les plus vus/cliqués
        ];
    }

    /**
     * Recherche classique par mots-clés (ex: "générateur image", "chatgpt").
     * Interroge directement la base de données (SQL LIKE ou Full-Text).
     */
    public function searchByKeywords(string $query): array
    {
        $cleanQuery = trim($query);
        
        if (empty($cleanQuery)) {
            return [];
        }

        return $this->toolModel->searchByKeywords($cleanQuery);
    }

    /**
     * LA RECHERCHE MAGIQUE PAR IA 🪄
     * L'utilisateur tape un problème (ex: "Je suis étudiant et je veux résumer des PDF").
     * L'IA analyse, prend en compte sa profession, et renvoie une réponse ciblée.
     */
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

    /**
     * Filtrage avancé pour la page "Explorer".
     * Permet à l'utilisateur de cliquer sur des tags (Catégories, Fournisseurs).
     */
    public function filterTools(?int $categoryId = null, ?int $providerId = null): array
    {
        // S'il n'y a aucun filtre, on renvoie tout (ou une pagination)
        if ($categoryId === null && $providerId === null) {
            return $this->toolModel->all();
        }

        return $this->toolModel->filter($categoryId, $providerId);
    }

    /**
     * Page de détail d'un outil spécifique (Vue complète).
     * Ramène toutes les infos (Modèles, Fonctionnalités, Fournisseur) + Outils similaires.
     */
    public function getToolDetails(int $toolId): ?array
    {
        if ($toolId <= 0) {
            return null;
        }

        // Suppose que votre ToolModel a une méthode qui fait les JOIN SQL nécessaires
        $tool = $this->toolModel->findByIdWithDetails($toolId);

        if (!$tool) {
            return null; // L'outil n'existe pas ou a été supprimé
        }

        // Bonus UX : On ajoute automatiquement 3 outils similaires de la même catégorie !
        $tool['similar_tools'] = $this->toolModel->getSimilarTools($tool['category_id'], $toolId, 3);

        return $tool;
    }
}
