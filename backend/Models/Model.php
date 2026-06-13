<?php

declare(strict_types=1);

namespace App\Models;



final class Model extends BaseModel
{
    // Creates a new model and returns its ID
    public function create(array $data): int
    {
        $sql = 'INSERT INTO models (
                    provider_id, 
                    name, 
                    description, 
                    status
                ) VALUES (
                    :provider_id, 
                    :name, 
                    :description, 
                    :status
                )';

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':provider_id' => (int) $data['provider_id'],
            ':name'        => $data['name'],
            ':description' => $data['description'] ?? null,
            ':status'      => $data['status'] ?? 'active',
        ]);

        return (int) $this->db->lastInsertId();
    }
    // Finds a model by its ID
    public function findById(int $id): ?array
    {
        $sql = 'SELECT * FROM models WHERE id = ? LIMIT 1';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        $model = $stmt->fetch();

        return $model ?: null;
    }

    // Returns all models ordered by name
    public function all(): array
    {
        $sql = 'SELECT * FROM models ORDER BY name ASC';
        $stmt = $this->db->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    // Returns active models filtered by provider ID
    public function allByProviderId(int $providerId): array
    {
        $sql = 'SELECT * FROM models WHERE provider_id = ? AND status = \'active\' ORDER BY name ASC';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$providerId]);

        return $stmt->fetchAll();
    }
    // Updates an existing model's fields
    public function update(int $id, array $data): bool
    {
        $sql = 'UPDATE models SET provider_id = :provider_id, name = :name, description = :description, status = :status WHERE id = :id';
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':provider_id' => (int) $data['provider_id'],
            ':name'        => $data['name'],
            ':description' => $data['description'] ?? null,
            ':status'      => $data['status'] ?? 'active',
            ':id'          => $id,
        ]);
    }

    // Deletes a model by its ID
    public function delete(int $id): bool
    {
        $sql = 'DELETE FROM models WHERE id = ?';
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([$id]);
    }

    // Updates only the status field of a model
    public function updateStatus(int $id, string $status): bool
    {
        $sql = 'UPDATE models SET status = :status WHERE id = :id';
        $stmt = $this->db->prepare($sql);
        
        return $stmt->execute([
            ':status' => $status,
            ':id'     => $id
        ]);
    }
}