<?php

declare(strict_types=1);

namespace App\Models;



final class Provider extends BaseModel
{
    // Creates a new provider and returns its ID
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

    // Updates an existing provider's fields
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
    // Finds a provider by its ID
    public function findById(int $id): ?array
    {
        $sql = 'SELECT * FROM providers WHERE id = ? LIMIT 1';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        $provider = $stmt->fetch();

        return $provider ?: null;
    }
    // Finds a provider by its name
    public function findByName(string $name): ?array
    {
        $sql = 'SELECT * FROM providers WHERE name = ? LIMIT 1';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$name]);
        $provider = $stmt->fetch();

        return $provider ?: null;
    }
    // Updates only the status field of a provider
    public function updateStatus(int $id, string $status): bool
    {
        $sql = 'UPDATE providers SET status = :status WHERE id = :id';
        $stmt = $this->db->prepare($sql);
        
        return $stmt->execute([
            ':status' => $status,
            ':id'     => $id
        ]);
    }
    // Returns all providers ordered by name
    public function all(): array
    {
        $sql = 'SELECT * FROM providers ORDER BY name ASC';
        $stmt = $this->db->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    // Returns only active providers (limited fields)
    public function allActive(): array
    {
        $sql = 'SELECT id, name, website_url FROM providers WHERE status = \'active\' ORDER BY name ASC';
        $stmt = $this->db->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll();
    }
    // Returns all providers filtered by a specific status
    public function allByStatus(string $status): array
    {
        $sql = 'SELECT * FROM providers WHERE status = ? ORDER BY created_at ASC';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$status]);

        return $stmt->fetchAll();
    }

    // Deletes a provider by its ID
    public function delete(int $id): bool
    {
        $sql = 'DELETE FROM providers WHERE id = ?';
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([$id]);
    }
}