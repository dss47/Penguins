<?php

declare(strict_types=1);

namespace App\Models;



final class ShelfItem extends BaseModel
{
    // Returns all tools in a shelf, with tool details
    public function allByShelfId(int $shelfId): array
    {
        $sql = 'SELECT t.*, si.created_at AS added_to_shelf_at 
                FROM shelf_items si
                INNER JOIN ai_tools t ON si.tool_id = t.id
                WHERE si.shelf_id = ?
                ORDER BY si.created_at DESC';

        $stmt = $this->db->prepare($sql);
        $stmt->execute([$shelfId]);

        return $stmt->fetchAll();
    }
    // Finds a shelf item by its ID
    public function findById(int $id): ?array
    {
        $sql = 'SELECT * FROM shelf_items WHERE id = ? LIMIT 1';
        $stmt = $this->db->prepare($sql); 
        $stmt->execute([$id]);
        
        return $stmt->fetch() ?: null;
    }

    // Adds a tool to a shelf and returns the new item ID
    public function addToShelf(array $data): int 
    {
        $sql = 'INSERT INTO shelf_items (
                    shelf_id, 
                    tool_id
                ) VALUES (
                    :shelf_id, 
                    :tool_id
                )';
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':shelf_id' => (int) $data['shelf_id'],
            ':tool_id'  => (int) $data['tool_id'],
        ]);

        return (int) $this->db->lastInsertId();
    }

    // Removes a tool from a shelf
    public function removeFromShelf(int $shelfId, int $toolId): bool
    {
        $sql = 'DELETE FROM shelf_items WHERE shelf_id = ? AND tool_id = ?';
        $stmt = $this->db->prepare($sql);
        
        return $stmt->execute([$shelfId, $toolId]);
    }

    // Checks whether a tool is already in a shelf
    public function exists(int $shelfId, int $toolId): bool
    {
        $sql = 'SELECT 1 FROM shelf_items WHERE shelf_id = ? AND tool_id = ? LIMIT 1';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$shelfId, $toolId]);
        return (bool) $stmt->fetch();
    }

    // Toggles a tool in a shelf (adds if absent, removes if present), returns the action
    public function toggle(int $shelfId, int $toolId): string
    {
        if ($this->exists($shelfId, $toolId)) {
            $this->removeFromShelf($shelfId, $toolId);
            return 'removed';
        }
        $this->addToShelf(['shelf_id' => $shelfId, 'tool_id' => $toolId]);
        return 'added';
    }

    // Returns tools in a shelf with provider and category info
    public function getToolsByShelfId(int $shelfId): array
    {
        $sql = 'SELECT t.*, p.name AS provider_name, c.name AS category_name
                FROM shelf_items si
                INNER JOIN ai_tools t ON si.tool_id = t.id
                LEFT JOIN providers p ON t.provider_id = p.id
                LEFT JOIN categories c ON t.category_id = c.id
                WHERE si.shelf_id = ?
                ORDER BY si.created_at DESC';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$shelfId]);
        return $stmt->fetchAll();
    }
}