<?php

declare(strict_types=1);

final class ExploreController
{
    public function __construct(
        private readonly ExploreService $exploreService = new ExploreService(),
        private readonly AuthMiddleware $authMiddleware = new AuthMiddleware()
    ) {
    }

    public function home(): array
    {
        return Response::success($this->exploreService->home());
    }

    public function landingSummary(): array
    {
        return Response::success($this->exploreService->landingSummary());
    }

    public function search(array $query): array
    {
        return Response::success($this->exploreService->searchByKeywords((string) ($query['q'] ?? '')));
    }

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
