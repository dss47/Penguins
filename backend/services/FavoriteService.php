<?php

declare(strict_types=1);

final class FavoriteService
{
    public function __construct(private readonly FavoriteItem $favoriteItemModel = new FavoriteItem()) {}

    public function toggleFavorite(int $userId, int $toolId): string
    {
        $isFavorited = $this->favoriteItemModel->isFavorited($userId, $toolId);

        if ($isFavorited) {
            $this->favoriteItemModel->remove($userId, $toolId);
            return 'removed';
        }

        $this->favoriteItemModel->add($userId, $toolId);
        return 'added';
    }

    public function listUserFavorites(int $userId): array
    {
        return $this->favoriteItemModel->allByUserId($userId) ?: [];
    }
}