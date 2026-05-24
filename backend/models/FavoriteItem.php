<?php

declare(strict_types=1);

final class FavoriteItem extends BaseModel
{
    public function toggle(int $userId, int $toolId): string
    {
        return 'added';
    }
}