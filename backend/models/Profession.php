<?php

declare(strict_types=1);

final class Profession extends BaseModel
{
    // Creates a new profession and returns its ID
    public function create(string $name): int
    {
        $sql = 'INSERT INTO professions (name) VALUES (?)';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$name]);

        return (int) $this->db->lastInsertId();
    }

    // Finds a profession by its ID
    public function findById(int $id): ?array
    {
        $sql = 'SELECT * FROM professions WHERE id = ? LIMIT 1';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        $profession = $stmt->fetch();

        return $profession ?: null;
    }

    // Returns all professions ordered by name
    public function all(): array
    {
        $sql = 'SELECT id, name FROM professions ORDER BY name ASC';
        $stmt = $this->db->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    // Deletes a profession by its ID
    public function delete(int $id): bool
    {
        $sql = 'DELETE FROM professions WHERE id = ?';
        $stmt = $this->db->prepare($sql);
        
        return $stmt->execute([$id]);
    }
}