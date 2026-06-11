<?php

declare(strict_types=1);

final class SearchHistoryService
{
    public function __construct(
        private readonly SearchHistory $searchHistoryModel = new SearchHistory(),
        private readonly SearchHistoryTool $searchHistoryToolModel = new SearchHistoryTool()
    ) {
    }

    /**
     * Enregistre une nouvelle recherche magique (IA) dans l'historique de l'utilisateur.
     * Cette méthode est appelée juste après que l'ExploreService ait obtenu une réponse d'OpenRouter.
     */
    public function logSearch(int $userId, string $prompt, string $aiReasoning, array $recommendedToolIds): array
    {
        if ($userId <= 0 || empty(trim($prompt))) {
            return ['success' => false, 'message' => 'Données de recherche invalides.'];
        }

        // 1. Sauvegarde de la recherche principale (Le prompt et le raisonnement de l'IA)
        $searchId = $this->searchHistoryModel->create([
            'user_id'      => $userId,
            'prompt'       => trim($prompt),
            'ai_reasoning' => trim($aiReasoning)
        ]);

        // 2. Sauvegarde des outils recommandés dans la table pivot
        if ($searchId > 0 && !empty($recommendedToolIds)) {
            foreach ($recommendedToolIds as $toolId) {
                $this->searchHistoryToolModel->create([
                    'search_history_id' => $searchId,
                    'tool_id'           => (int) $toolId
                ]);
            }
        }

        return [
            'success' => true,
            'message' => 'Recherche sauvegardée dans l\'historique.',
            'search_id' => $searchId
        ];
    }

    /**
     * Récupère l'historique complet d'un utilisateur (pour son profil / dashboard).
     */
    public function getUserHistory(int $userId): array
    {
        if ($userId <= 0) {
            return [];
        }

        return $this->searchHistoryModel->findByUserId($userId);
    }

    /**
     * Récupère les détails d'une ancienne recherche, INCLUANT les outils qui avaient été recommandés.
     */
    public function getSearchDetails(int $searchId, int $userId): ?array
    {
        if ($searchId <= 0 || $userId <= 0) {
            return null;
        }

        // 1. Vérifie que la recherche existe et appartient bien à cet utilisateur (Sécurité)
        $search = $this->searchHistoryModel->findById($searchId);
        
        if (!$search || (int)$search['user_id'] !== $userId) {
            return null;
        }

        // 2. Récupère les outils liés à cette recherche
        // (Le modèle SearchHistoryTool devrait idéalement faire un JOIN avec la table tools pour ramener le nom/logo)
        $search['recommended_tools'] = $this->searchHistoryToolModel->getToolsBySearchId($searchId);

        return $search;
    }

    /**
     * Permet à l'utilisateur de vider son historique (Fonctionnalité de confidentialité / RGPD).
     */
    public function clearUserHistory(int $userId): array
    {
        if ($userId <= 0) {
            return ['success' => false, 'message' => 'ID Utilisateur invalide.'];
        }

        // Note: Assurez-vous que votre base de données utilise "ON DELETE CASCADE" 
        // sur la clé étrangère de la table `search_history_tools`.
        // Ainsi, supprimer l'historique principal supprimera automatiquement les liens avec les outils.
        $deleted = $this->searchHistoryModel->deleteAllByUserId($userId);

        return [
            'success' => $deleted,
            'message' => $deleted ? 'Historique effacé avec succès.' : 'Erreur lors de la suppression de l\'historique.'
        ];
    }
}