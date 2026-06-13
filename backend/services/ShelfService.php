<?php

declare(strict_types=1);

final class ShelfService
{
    public function __construct(
        private readonly Shelf $shelfModel = new Shelf(), 
        private readonly ShelfItem $shelfItemModel = new ShelfItem()
    ) {
    }

    // Returns the user's shelves with a flag indicating whether a given tool is in each shelf
    public function getUserShelvesWithStatus(int $userId, int $toolId): array
    {
        if ($userId <= 0 || $toolId <= 0) {
            return [];
        }

        $shelves = $this->shelfModel->findByUserId($userId);

        foreach ($shelves as &$shelf) {
            $shelf['is_in_shelf'] = $this->shelfItemModel->exists((int) $shelf['id'], $toolId);
        }

        return $shelves;
    }

    // Lists all shelves for a user, including tool count and tool details for each shelf
    public function listUserShelves(int $userId): array
    {
        if ($userId <= 0) {
            return [];
        }

        $shelves = $this->shelfModel->findByUserId($userId);

        foreach ($shelves as &$shelf) {
            $items = $this->shelfItemModel->getToolsByShelfId((int) $shelf['id']);
            $shelf['tool_count'] = count($items);
            $shelf['tools'] = $items;
        }

        return $shelves;
    }

    // Creates a new empty shelf for the user with a given name and optional description
    public function createEmptyShelf(string $name, int $userId, ?string $description = null): array
    {
        $cleanName = trim($name);

        if ($userId <= 0) {
            return ['success' => false, 'message' => 'Utilisateur non valide.'];
        }

        if (empty($cleanName)) {
            return ['success' => false, 'message' => 'Le nom de la collection ne peut pas être vide.'];
        }

        $shelfId = $this->shelfModel->create([
            'user_id'     => $userId,
            'name'        => $cleanName,
            'description' => $description ? trim($description) : null,
        ]);

        return [
            'success' => true,
            'message' => 'Collection créée avec succès.',
            'shelf'   => $this->shelfModel->findById($shelfId)
        ];
    }

    // Toggles a tool's membership in a shelf (adds if absent, removes if present)
    public function toggleShelfItem(int $shelfId, int $toolId): string
    {
        if ($shelfId <= 0 || $toolId <= 0) {
            return 'error';
        }

        return $this->shelfItemModel->toggle($shelfId, $toolId);
    }
    
    // Updates the name and description of a shelf, verifying ownership
    public function updateShelf(int $shelfId, string $name, ?string $description, int $userId): array
    {
        $shelf = $this->shelfModel->findById($shelfId);
        if (!$shelf || (int) $shelf['user_id'] !== $userId) {
            return ['success' => false, 'message' => 'Collection introuvable.'];
        }
        $cleanName = trim($name);
        if (empty($cleanName)) {
            return ['success' => false, 'message' => 'Le nom ne peut pas être vide.'];
        }
        $this->shelfModel->update($shelfId, [
            'name'        => $cleanName,
            'description' => $description ? trim($description) : null,
        ]);
        return ['success' => true, 'message' => 'Collection mise à jour.', 'shelf' => $this->shelfModel->findById($shelfId)];
    }

    // Deletes a shelf, verifying ownership
    public function deleteShelf(int $shelfId, int $userId): array
    {
        $shelf = $this->shelfModel->findById($shelfId);
        if (!$shelf || (int) $shelf['user_id'] !== $userId) {
            return ['success' => false, 'message' => 'Collection introuvable.'];
        }
        $this->shelfModel->delete($shelfId);
        return ['success' => true, 'message' => 'Collection supprimée.'];
    }

    // Returns basic info for a shelf, verifying ownership
    public function getShelfInfo(int $shelfId, int $userId): ?array
    {
        if ($shelfId <= 0 || $userId <= 0) {
            return null;
        }
        $shelf = $this->shelfModel->findById($shelfId);
        if (!$shelf || (int) $shelf['user_id'] !== $userId) {
            return null;
        }
        return $shelf;
    }

    // Returns all tools in a shelf, verifying ownership
    public function getToolsInShelf(int $shelfId, int $userId): array
    {
        if ($shelfId <= 0 || $userId <= 0) {
            return [];
        }
        
        $shelf = $this->shelfModel->findById($shelfId);
        if (!$shelf || (int) $shelf['user_id'] !== $userId) {
            return [];
        }

        return $this->shelfItemModel->getToolsByShelfId($shelfId);
    }
}