<?php

declare(strict_types=1);

final class FavoriteController
{
    public function __construct(
        private readonly FavoriteService $favoriteService = new FavoriteService(),
        private readonly AuthMiddleware $authMiddleware = new AuthMiddleware()
    ) {}

    // Authenticates the user via JWT and returns the user ID
    private function getUserId(): ?int
    {
        $payload = $this->authMiddleware->authenticate();
        return $payload ? (int) ($payload['user_id'] ?? 0) : null;
    }

    // Returns all favorited tools for the authenticated user
    public function index(): array
    {
        $userId = $this->getUserId();
        if (!$userId) {
            return Response::error('Non authentifié', 401);
        }
        return Response::success($this->favoriteService->listUserFavorites($userId));
    }

    // Toggles a tool as favorite for the authenticated user
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