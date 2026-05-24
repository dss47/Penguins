<?php

declare(strict_types=1);

final class ShelfItem extends BaseModel
{
    public function toggle(int $shelfId, int $toolId): string
    {
        return 'added';
    }
}