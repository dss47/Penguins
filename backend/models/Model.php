<?php

declare(strict_types=1);

final class Model extends BaseModel
{
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
    public function findById(int $id): ?array
    {
        $sql = 'SELECT * FROM models WHERE id = ? LIMIT 1';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        $model = $stmt->fetch();

        return $model ?: null;
    }
    public function allByProviderId(int $providerId): array
    {
        $sql = 'SELECT * FROM models WHERE provider_id = ? AND status = \'active\' ORDER BY name ASC';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$providerId]);

        return $stmt->fetchAll();
    }
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