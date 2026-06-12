<?php

declare(strict_types=1);

final class FavoriteController
{
    public function __construct(
        private readonly FavoriteService $favoriteService = new FavoriteService(),
        private readonly AuthMiddleware $authMiddleware = new AuthMiddleware()
    ) {}

    private function getUserId(): ?int
    {
        $payload = $this->authMiddleware->authenticate();
        return $payload ? (int) ($payload['user_id'] ?? 0) : null;
    }

    public function index(): array
    {
        $userId = $this->getUserId();
        if (!$userId) {
            return Response::error('Non authentifié', 401);
        }
        return Response::success($this->favoriteService->listUserFavorites($userId));
    }

    public function toggle(array $payload): array
    {
        $userId = $this->getUserId();
        if (!$userId) {
            return Response::error('Non authentifié', 401);
        }
        return Response::success([
            'action' => $this->favoriteService->toggleFavorite($userId, (int) ($payload['tool_id'] ?? 0)),
        ]);
    }
}