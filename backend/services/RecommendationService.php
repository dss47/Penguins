<?php

declare(strict_types=1);

final class RecommendationService
{
    public function __construct(
        private readonly Tool $toolModel = new Tool(),
        private readonly OpenRouterService $openRouterService = new OpenRouterService(),
        private readonly SearchHistoryService $searchHistoryService = new SearchHistoryService()
    ) {
    }

    // Handles the full "Magic Search / Assistant" flow: gets AI recommendations and logs them
    public function generateTop6Recommendations(int $userId, string $prompt, string $userProfession = 'Utilisateur'): array
    {
        if (empty(trim($prompt))) {
            return ['success' => false, 'message' => "Votre requête est vide."];
        }

        $availableTools = $this->toolModel->getSlimToolsList(); 

        $aiResponseJson = $this->openRouterService->getTop6Recommendations($prompt, $userProfession, $availableTools);

        if (!$aiResponseJson) {
            return ['success' => false, 'message' => "Notre assistant IA est temporairement indisponible."];
        }

        $aiData = json_decode($aiResponseJson, true);

        $historyId = $this->searchHistoryService->logSearch(
            $userId, 
            $prompt, 
            $aiData['ai_reasoning'], 
            $aiData['recommended_tool_ids']
        );

        $topTools = $this->toolModel->findByIds($aiData['recommended_tool_ids']);

        return [
            'success'      => true,
            'history_id'   => $historyId,
            'ai_reasoning' => $aiData['ai_reasoning'],
            'tools'        => $topTools
        ];
    }
}