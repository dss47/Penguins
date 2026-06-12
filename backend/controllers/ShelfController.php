<?php

declare(strict_types=1);

final class ShelfController
{
    public function __construct(
        private readonly ShelfService $shelfService = new ShelfService(),
        private readonly AuthMiddleware $authMiddleware = new AuthMiddleware()
    ) {}

    private function getUserId(): ?int
    {
        $payload = $this->authMiddleware->authenticate();
        return $payload ? (int) ($payload['user_id'] ?? 0) : null;
    }

    public function list(): array
    {
        $userId = $this->getUserId();
        if (!$userId) {
            return Response::error('Non authentifié', 401);
        }
        return Response::success($this->shelfService->listUserShelves($userId));
    }

    public function show(array $query): array
    {
        $userId = $this->getUserId();
        if (!$userId) {
            return Response::error('Non authentifié', 401);
        }
        $shelfId = (int) ($query['id'] ?? 0);
        if ($shelfId <= 0) {
            return Response::error('ID de collection requis.', 400);
        }
        $tools = $this->shelfService->getToolsInShelf($shelfId, $userId);
        $shelf = $this->shelfService->getShelfInfo($shelfId, $userId);
        return Response::success(['shelf' => $shelf, 'tools' => $tools]);
    }

    public function create(array $payload): array
    {
        $userId = $this->getUserId();
        if (!$userId) {
            return Response::error('Non authentifié', 401);
        }
        return $this->shelfService->createEmptyShelf($payload['name'] ?? '', $userId, $payload['description'] ?? null);
    }

    public function update(array $payload): array
    {
        $userId = $this->getUserId();
        if (!$userId) {
            return Response::error('Non authentifié', 401);
        }
        return $this->shelfService->updateShelf(
            (int) ($payload['id'] ?? 0),
            $payload['name'] ?? '',
            $payload['description'] ?? null,
            $userId
        );
    }

    public function delete(array $payload): array
    {
        $userId = $this->getUserId();
        if (!$userId) {
            return Response::error('Non authentifié', 401);
        }
        return $this->shelfService->deleteShelf((int) ($payload['id'] ?? 0), $userId);
    }

    public function toggleItem(array $payload): array
    {
        $userId = $this->getUserId();
        if (!$userId) {
            return Response::error('Non authentifié', 401);
        }
        $shelfId = (int) ($payload['shelf_id'] ?? 0);
        $toolId = (int) ($payload['tool_id'] ?? 0);
        if ($shelfId <= 0 || $toolId <= 0) {
            return Response::error('Paramètres invalides.', 400);
        }
        return Response::success([
            'action' => $this->shelfService->toggleShelfItem($shelfId, $toolId),
        ]);
    }
}