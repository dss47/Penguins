<?php

declare(strict_types=1);

final class Provider extends BaseModel
{
    public function create(array $data): int
    {
        $sql = 'INSERT INTO providers (
                    name, 
                    website_url, 
                    description, 
                    status
                ) VALUES (
                    :name, 
                    :website_url, 
                    :description, 
                    :status
                )';

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':name'        => $data['name'],
            ':website_url' => $data['website_url'] ?? null,
            ':description' => $data['description'] ?? null,
            ':status'      => $data['status'] ?? 'pending',
        ]);

        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $sql = 'UPDATE providers SET name = :name, website_url = :website_url, description = :description, status = :status WHERE id = :id';
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':name'        => $data['name'],
            ':website_url' => $data['website_url'] ?? null,
            ':description' => $data['description'] ?? null,
            ':status'      => $data['status'] ?? 'pending',
            ':id'          => $id,
        ]);
    }
    public function findById(int $id): ?array
    {
        $sql = 'SELECT * FROM providers WHERE id = ? LIMIT 1';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        $provider = $stmt->fetch();

        return $provider ?: null;
    }
    public function findByName(string $name): ?array
    {
        $sql = 'SELECT * FROM providers WHERE name = ? LIMIT 1';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$name]);
        $provider = $stmt->fetch();

        return $provider ?: null;
    }
    public function updateStatus(int $id, string $status): bool
    {
        $sql = 'UPDATE providers SET status = :status WHERE id = :id';
        $stmt = $this->db->prepare($sql);
        
        return $stmt->execute([
            ':status' => $status,
            ':id'     => $id
        ]);
    }
    public function all(): array
    {
        $sql = 'SELECT * FROM providers ORDER BY name ASC';
        $stmt = $this->db->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    public function allActive(): array
    {
        $sql = 'SELECT id, name, website_url FROM providers WHERE status = \'active\' ORDER BY name ASC';
        $stmt = $this->db->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll();
    }
    public function allByStatus(string $status): array
    {
        $sql = 'SELECT * FROM providers WHERE status = ? ORDER BY created_at ASC';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$status]);

        return $stmt->fetchAll();
    }

    public function delete(int $id): bool
    {
        $sql = 'DELETE FROM providers WHERE id = ?';
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([$id]);
    }
}