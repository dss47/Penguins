<?php

declare(strict_types=1);

final class SearchHistoryController
{
    public function __construct(
        private readonly SearchHistoryService $searchHistoryService = new SearchHistoryService(),
        private readonly AuthMiddleware $authMiddleware = new AuthMiddleware()
    ) {
    }

    public function list(): array
    {
        $user = $this->authMiddleware->authenticate();
        if (!$user || !($user['user_id'] ?? 0)) {
            return Response::error('Non authentifié', 401);
        }

        $userId = (int) $user['user_id'];
        $history = $this->searchHistoryService->listUserHistory($userId);

        return Response::success($history);
    }
}
