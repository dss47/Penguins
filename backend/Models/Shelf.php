<?php

declare(strict_types=1);

namespace App\Models;



final class Shelf extends BaseModel
{

    // Returns all shelves belonging to a user
    public function allByUserId(int $userId): array
    {
        $sql = 'SELECT * FROM shelves WHERE user_id = ? ORDER BY created_at DESC';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId]);

        return $stmt->fetchAll();
    }

    // Finds a shelf by its ID
    public function findById(int $shelfId): ?array
    {
        $sql = 'SELECT * FROM shelves WHERE id = ? LIMIT 1';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$shelfId]);
        $shelf = $stmt->fetch();

        return $shelf ?: null;
    }

    // Finds all shelves for a user (alias for allByUserId)
    public function findByUserId(int $userId): array
    {
        return $this->allByUserId($userId);
    }

    // Creates a new shelf for a user and returns its ID
    public function create(array $data): int
    {
        $sql = 'INSERT INTO shelves (
                    user_id, 
                    name, 
                    description
                ) VALUES (
                    :user_id, 
                    :name, 
                    :description
                )';

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':user_id'     => (int) $data['user_id'],
            ':name'        => $data['name'],
            ':description' => $data['description'] ?? null,
        ]);

        return (int) $this->db->lastInsertId();
    }

    // Updates a shelf's name and description
    public function update(int $id, array $data): bool
    {
        $sql = 'UPDATE shelves SET name = :name, description = :description WHERE id = :id';
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':name'        => $data['name'],
            ':description' => $data['description'] ?? null,
            ':id'          => $id,
        ]);
    }

    // Deletes a shelf and all its associated items
    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare('DELETE FROM shelf_items WHERE shelf_id = ?');
        $stmt->execute([$id]);

        $stmt = $this->db->prepare('DELETE FROM shelves WHERE id = ?');
        return $stmt->execute([$id]);
    }
}