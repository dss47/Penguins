<?php

declare(strict_types=1);

final class ExploreService
{
    // On injecte le Tool Model, mais aussi le OpenRouterService pour la recherche intelligente !
    public function __construct(
        private readonly Tool $toolModel = new Tool(),
        private readonly OpenRouterService $openRouterService = new OpenRouterService()
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
    public function searchByPrompt(string $prompt, string $userProfession = 'Utilisateur'): array
    {
        if (empty(trim($prompt))) {
            return [
                'success' => false,
                'message' => "Votre requête ne peut pas être vide."
            ];
        }

        // Appel de votre service IA que nous avons créé précédemment
        $aiAnswer = $this->openRouterService->getRecommendations($prompt, $userProfession);

        if (!$aiAnswer) {
            return [
                'success' => false,
                'message' => "L'IA est actuellement indisponible. Veuillez réessayer plus tard."
            ];
        }

        return [
            'success' => true,
            'data' => [
                'prompt' => $prompt,
                'profession_context' => $userProfession,
                'ai_reasoning' => $aiAnswer
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