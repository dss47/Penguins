<?php

declare(strict_types=1);

final class Feature extends BaseModel
{

    public function create(array $data): int
    {
        $sql = 'INSERT INTO features (
                    name, 
                    description, 
                    type, 
                    status
                ) VALUES (
                    :name, 
                    :description, 
                    :type, 
                    :status
                )';

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':name'        => $data['name'],
            ':description' => $data['description'] ?? null,
            ':type'        => $data['type'] ?? null, 
            ':status'      => $data['status'] ?? 'active',
        ]);

        return (int) $this->db->lastInsertId();
    }
    public function findById(int $id): ?array
    {
        $sql = 'SELECT * FROM features WHERE id = ? LIMIT 1';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        $feature = $stmt->fetch();

        return $feature ?: null;
    }
    public function allActive(): array
    {
        $sql = 'SELECT * FROM features WHERE status = \'active\' ORDER BY type ASC, name ASC';
        $stmt = $this->db->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll();
    }
    public function updateStatus(int $id, string $status): bool
    {
        $sql = 'UPDATE features SET status = :status WHERE id = :id';
        $stmt = $this->db->prepare($sql);
        
        return $stmt->execute([
            ':status' => $status,
            ':id'     => $id
        ]);
    }
}