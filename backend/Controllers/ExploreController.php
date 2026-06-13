<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Services\ExploreService;
use App\Middleware\AuthMiddleware;
use App\Utils\Response;



final class ExploreController
{
    public function __construct(
        private readonly ExploreService $exploreService = new ExploreService(),
        private readonly AuthMiddleware $authMiddleware = new AuthMiddleware()
    ) {
    }

    // Returns home page data (latest, featured, trending tools)
    public function home(): array
    {
        return Response::success($this->exploreService->home());
    }

    // Returns landing page summary stats (tool count, categories, community members)
    public function landingSummary(): array
    {
        return Response::success($this->exploreService->landingSummary());
    }

    // Searches tools by keyword query
    public function search(array $query): array
    {
        return Response::success($this->exploreService->searchByKeywords((string) ($query['q'] ?? '')));
    }

    // Performs an AI-powered recommendation based on a user's prompt
    public function recommend(array $body): array
    {
        $prompt = (string) ($body['prompt'] ?? '');
        $user = $this->authMiddleware->authenticate();
        $userId = $user ? (int) ($user['user_id'] ?? 0) : null;

        $result = $this->exploreService->searchByPrompt($prompt, $userId);
        if (($result['success'] ?? false) === false) {
            return Response::error($result['message'] ?? 'Erreur lors de la recommandation.');
        }

        return Response::success($result['data'] ?? $result);
    }
}
