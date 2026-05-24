<?php

declare(strict_types=1);

final class FavoriteService
{
    public function __construct(private readonly FavoriteItem $favoriteItemModel = new FavoriteItem())
    {
    }

    public function toggleFavorite(int $userId, int $toolId): string
    {
        return $this->favoriteItemModel->toggle($userId, $toolId);
    }
}