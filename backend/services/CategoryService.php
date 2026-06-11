<?php

declare(strict_types=1);

final class CategoryService
{
    public function __construct(private readonly Category $categoryModel = new Category())
    {
    }

    /**
     * Récupère toutes les catégories.
     * Idéalement triées par nom ou par date de création dans le modèle.
     */
    public function getAllCategories(): array
    {
        return $this->categoryModel->all();
    }

    /**
     * Récupère une catégorie spécifique par son ID.
     */
    public function getCategoryById(int $id): ?array
    {
        if ($id <= 0) {
            return null;
        }
        
        return $this->categoryModel->findById($id);
    }

    /**
     * Crée une nouvelle catégorie après validation des données.
     */
    public function createCategory(array $data): array
    {
        // Validation basique : le nom est obligatoire
        if (empty(trim($data['name'] ?? ''))) {
            throw new InvalidArgumentException("Le nom de la catégorie est obligatoire.");
        }

        // Préparation des données sécurisées pour le modèle
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

    /**
     * Met à jour une catégorie existante.
     */
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

    /**
     * Supprime une catégorie.
     * Attention : Assurez-vous que le modèle gère bien les contraintes de clés étrangères 
     * (par exemple, que faire des outils liés à cette catégorie ?).
     */
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