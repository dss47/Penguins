<?php

declare(strict_types=1);

final class Category extends BaseModel
{

    // Creates a new category and returns its ID
    public function create(array $data): int
    {
        $sql = 'INSERT INTO categories (
                    name, 
                    icon, 
                    description
                ) VALUES (
                    :name, 
                    :icon, 
                    :description
                )';

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':name'        => $data['name'],
            ':icon'        => $data['icon'] ?? null, // Stores raw emoji or CSS icon class string
            ':description' => $data['description'] ?? null,
        ]);

        return (int) $this->db->lastInsertId();
    }

    // Updates an existing category's name, icon, and description
    public function update(int $id, array $data): bool
    {
        $sql = 'UPDATE categories SET name = :name, icon = :icon, description = :description WHERE id = :id';
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':name'        => $data['name'],
            ':icon'        => $data['icon'] ?? null,
            ':description' => $data['description'] ?? null,
            ':id'          => $id,
        ]);
    }

    // Finds a category by its ID
    public function findById(int $id): ?array
    {
        $sql = 'SELECT * FROM categories WHERE id = ? LIMIT 1';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        $category = $stmt->fetch();

        return $category ?: null;
    }

    // Returns all categories ordered by name
    public function all(): array
    {
        $sql = 'SELECT id, name, icon, description FROM categories ORDER BY name ASC';
        $stmt = $this->db->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    // Deletes a category by its ID
    public function delete(int $id): bool
    {
        $sql = 'DELETE FROM categories WHERE id = ?';
        $stmt = $this->db->prepare($sql);
        
        return $stmt->execute([$id]);
    }
}