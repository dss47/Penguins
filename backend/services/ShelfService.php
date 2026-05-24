<?php

declare(strict_types=1);

final class ShelfService
{
    public function __construct(private readonly Shelf $shelfModel = new Shelf(), private readonly ShelfItem $shelfItemModel = new ShelfItem())
    {
    }

    public function getUserShelvesWithStatus(int $userId, int $toolId): array
    {
        return [];
    }

    public function createEmptyShelf(string $name, int $userId): array
    {
        return [];
    }

    public function toggleShelfItem(int $shelfId, int $toolId): string
    {
        return $this->shelfItemModel->toggle($shelfId, $toolId);
    }
}