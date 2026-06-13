<?php

declare(strict_types=1);

final class CategoryService
{
    public function __construct(private readonly Category $categoryModel = new Category())
    {
    }

    // Returns all categories, ideally sorted by name or creation date
    public function getAllCategories(): array
    {
        return $this->categoryModel->all();
    }

    // Returns a single category by its ID
    public function getCategoryById(int $id): ?array
    {
        if ($id <= 0) {
            return null;
        }
        
        return $this->categoryModel->findById($id);
    }

    // Creates a new category after data validation
    public function createCategory(array $data): array
    {
        if (empty(trim($data['name'] ?? ''))) {
            throw new InvalidArgumentException("Le nom de la catégorie est obligatoire.");
        }

        $payload = [
            'name'        => trim($data['name']),
            'icon'        => !empty($data['icon']) ? trim($data['icon']) : null,
            'description' => !empty($data['description']) ? trim($data['description']) : null
        ];

        $id = $this->categoryModel->create($payload);

        return [
            'success' => true,
            'message' => 'Catégorie créée avec succès.',
            'data'    => $this->getCategoryById($id)
        ];
    }

    // Updates an existing category
    public function updateCategory(int $id, array $data): array
    {
        if ($id <= 0) {
            throw new InvalidArgumentException("ID de catégorie invalide.");
        }

        if (empty(trim($data['name'] ?? ''))) {
            throw new InvalidArgumentException("Le nom de la catégorie ne peut pas être vide.");
        }

        $payload = [
            'name'        => trim($data['name']),
            'icon'        => !empty($data['icon']) ? trim($data['icon']) : null,
            'description' => !empty($data['description']) ? trim($data['description']) : null
        ];

        $updated = $this->categoryModel->update($id, $payload);

        if (!$updated) {
            return [
                'success' => false,
                'message' => 'La mise à jour a échoué (la catégorie n\'existe pas ou aucune modification détectée).'
            ];
        }

        return [
            'success' => true,
            'message' => 'Catégorie mise à jour avec succès.',
            'data'    => $this->getCategoryById($id)
        ];
    }

    // Deletes a category (ensure foreign key constraints are handled in the model)
    public function deleteCategory(int $id): array
    {
        if ($id <= 0) {
            throw new InvalidArgumentException("ID de catégorie invalide.");
        }

        $deleted = $this->categoryModel->delete($id);

        if (!$deleted) {
            return [
                'success' => false,
                'message' => 'Impossible de supprimer cette catégorie.'
            ];
        }

        return [
            'success' => true,
            'message' => 'Catégorie supprimée avec succès.'
        ];
    }
}