<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\FavoriteItem;



final class FavoriteService
{
    public function __construct(private readonly FavoriteItem $favoriteItemModel = new FavoriteItem()) {}

    // Toggles a tool as favorite for the user: adds if not favorited, removes if already favorited
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

    // Returns all favorited tools for a given user
    public function listUserFavorites(int $userId): array
    {
        return $this->favoriteItemModel->allByUserId($userId) ?: [];
    }
}