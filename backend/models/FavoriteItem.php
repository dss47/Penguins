<?php

declare(strict_types=1);

final class FavoriteItem extends BaseModel
{

    // Adds a tool to a user's favorites
    public function add(int $userId, int $toolId): bool
    {
        $sql = 'INSERT INTO favorite_items (user_id, tool_id) VALUES (?, ?)';
        $stmt = $this->db->prepare($sql);
        
        return $stmt->execute([$userId, $toolId]);
    }

    // Removes a tool from a user's favorites
    public function remove(int $userId, int $toolId): bool
    {
        $sql = 'DELETE FROM favorite_items WHERE user_id = ? AND tool_id = ?';
        $stmt = $this->db->prepare($sql);
        
        return $stmt->execute([$userId, $toolId]);
    }
    // Checks if a tool is in a user's favorites
    public function isFavorited(int $userId, int $toolId): bool
    {
        $sql = 'SELECT 1 FROM favorite_items WHERE user_id = ? AND tool_id = ? LIMIT 1';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId, $toolId]);
        
        return (bool) $stmt->fetch();
    }
    // Returns all favorited tools for a user, with provider and category info
    public function allByUserId(int $userId): array
    {
        $sql = 'SELECT t.*, p.name AS provider_name, c.name AS category_name
                FROM favorite_items fi
                INNER JOIN ai_tools t ON fi.tool_id = t.id
                INNER JOIN providers p ON t.provider_id = p.id
                INNER JOIN categories c ON t.category_id = c.id
                WHERE fi.user_id = ?
                ORDER BY fi.created_at DESC';

        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId]);

        return $stmt->fetchAll();
    }
}