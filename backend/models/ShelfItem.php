<?php

declare(strict_types=1);

final class ShelfItem extends BaseModel
{
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
    public function findById(int $id): ?array
    {
        $sql = 'SELECT * FROM shelf_items WHERE id = ? LIMIT 1';
        $stmt = $this->db->prepare($sql); 
        $stmt->execute([$id]);
        
        return $stmt->fetch() ?: null;
    }

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

    public function removeFromShelf(int $shelfId, int $toolId): bool
    {
        $sql = 'DELETE FROM shelf_items WHERE shelf_id = ? AND tool_id = ?';
        $stmt = $this->db->prepare($sql);
        
        return $stmt->execute([$shelfId, $toolId]);
    }

    public function exists(int $shelfId, int $toolId): bool
    {
        $sql = 'SELECT 1 FROM shelf_items WHERE shelf_id = ? AND tool_id = ? LIMIT 1';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$shelfId, $toolId]);
        return (bool) $stmt->fetch();
    }

    public function toggle(int $shelfId, int $toolId): string
    {
        if ($this->exists($shelfId, $toolId)) {
            $this->removeFromShelf($shelfId, $toolId);
            return 'removed';
        }
        $this->addToShelf(['shelf_id' => $shelfId, 'tool_id' => $toolId]);
        return 'added';
    }

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