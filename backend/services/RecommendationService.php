<?php

declare(strict_types=1);

final class RecommendationService
{
    // Ce service a besoin de ces 3 éléments pour faire son travail
    public function __construct(
        private readonly Tool $toolModel = new Tool(),
        private readonly OpenRouterService $openRouterService = new OpenRouterService(),
        private readonly SearchHistoryService $searchHistoryService = new SearchHistoryService()
    ) {
    }

    /**
     * Gère le flux complet de la page "Recherche Magique / Assistant".
     */
    public function generateTop6Recommendations(int $userId, string $prompt, string $userProfession = 'Utilisateur'): array
    {
        if (empty(trim($prompt))) {
            return ['success' => false, 'message' => "Votre requête est vide."];
        }

        // 1. On récupère la liste des outils pour l'envoyer à l'IA
        $availableTools = $this->toolModel->getSlimToolsList(); 

        // 2. L'IA analyse le prompt et choisit les 6 meilleurs outils
        $aiResponseJson = $this->openRouterService->getTop6Recommendations($prompt, $userProfession, $availableTools);

        if (!$aiResponseJson) {
            return ['success' => false, 'message' => "Notre assistant IA est temporairement indisponible."];
        }

        $aiData = json_decode($aiResponseJson, true);

        // 3. On sauvegarde la conversation dans l'historique de l'utilisateur
        $historyId = $this->searchHistoryService->logSearch(
            $userId, 
            $prompt, 
            $aiData['ai_reasoning'], 
            $aiData['recommended_tool_ids'] // Les 6 IDs choisis par l'IA
        );

        // 4. On récupère les fiches complètes de ces 6 outils pour l'affichage
        $topTools = $this->toolModel->findByIds($aiData['recommended_tool_ids']);

        return [
            'success'      => true,
            'history_id'   => $historyId,
            'ai_reasoning' => $aiData['ai_reasoning'],
            'tools'        => $topTools
        ];
    }
}