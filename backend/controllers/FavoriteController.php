<?php

declare(strict_types=1);

final class FavoriteController
{
    public function __construct(private readonly FavoriteService $favoriteService = new FavoriteService())
    {
    }

    public function toggle(array $payload, int $userId): array
    {
        return Response::success([
            'action' => $this->favoriteService->toggleFavorite($userId, (int) ($payload['tool_id'] ?? 0)),
        ]);
    }
}