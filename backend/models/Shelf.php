<?php

declare(strict_types=1);

final class Shelf extends BaseModel
{

    public function allByUserId(int $userId): array
    {
        $sql = 'SELECT * FROM shelves WHERE user_id = ? ORDER BY created_at DESC';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId]);

        return $stmt->fetchAll();
    }

    public function findById(int $shelfId): ?array
    {
        $sql = 'SELECT * FROM shelves WHERE id = ? LIMIT 1';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$shelfId]);
        $shelf = $stmt->fetch();

        return $shelf ?: null;
    }

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
}