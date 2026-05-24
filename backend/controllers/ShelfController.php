<?php

declare(strict_types=1);

final class ShelfController
{
    public function __construct(private readonly ShelfService $shelfService = new ShelfService())
    {
    }

    public function index(int $userId, int $toolId): array
    {
        return Response::success($this->shelfService->getUserShelvesWithStatus($userId, $toolId));
    }
}