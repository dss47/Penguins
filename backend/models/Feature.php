<?php

declare(strict_types=1);

final class Feature extends BaseModel
{

    // Creates a new feature and returns its ID
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

    // Updates an existing feature's fields
    public function update(int $id, array $data): bool
    {
        $sql = 'UPDATE features SET name = :name, description = :description, type = :type, status = :status WHERE id = :id';
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':name'        => $data['name'],
            ':description' => $data['description'] ?? null,
            ':type'        => $data['type'] ?? null,
            ':status'      => $data['status'] ?? 'active',
            ':id'          => $id,
        ]);
    }
    // Finds a feature by its ID
    public function findById(int $id): ?array
    {
        $sql = 'SELECT * FROM features WHERE id = ? LIMIT 1';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        $feature = $stmt->fetch();

        return $feature ?: null;
    }
    // Returns all features ordered by name
    public function all(): array
    {
        $sql = 'SELECT * FROM features ORDER BY name ASC';
        $stmt = $this->db->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    // Returns active features grouped by type, then name
    public function allActive(): array
    {
        $sql = 'SELECT * FROM features WHERE status = \'active\' ORDER BY type ASC, name ASC';
        $stmt = $this->db->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll();
    }
    // Deletes a feature by its ID
    public function delete(int $id): bool
    {
        $sql = 'DELETE FROM features WHERE id = ?';
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([$id]);
    }

    // Updates only the status field of a feature
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