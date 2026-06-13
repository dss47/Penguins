<?php

declare(strict_types=1);

final class FeatureService
{
    public function __construct(private readonly Feature $featureModel = new Feature())
    {
    }

    // Returns all features as a simple list
    public function getAllFeatures(): array
    {
        return $this->featureModel->all();
    }

    // Returns features grouped by their type (licensing, access, modality, capability)
    public function getGroupedFeatures(): array
    {
        $allFeatures = $this->featureModel->all();
        $grouped = [];

        foreach ($allFeatures as $feature) {
            $type = $feature['type'] ?? 'other';
            $grouped[$type][] = $feature;
        }

        return $grouped;
    }

    // Returns a single feature by its ID
    public function getFeatureById(int $id): ?array
    {
        if ($id <= 0) {
            return null;
        }
        
        return $this->featureModel->findById($id);
    }

    // Creates a new feature (Admin Panel)
    public function createFeature(array $data): array
    {
        if (empty(trim($data['name'] ?? ''))) {
            throw new InvalidArgumentException("Le nom de la fonctionnalité est obligatoire.");
        }

        if (empty(trim($data['type'] ?? ''))) {
            throw new InvalidArgumentException("Le type de la fonctionnalité est obligatoire.");
        }

        $payload = [
            'name'        => trim($data['name']),
            'description' => !empty($data['description']) ? trim($data['description']) : null,
            'type'        => trim($data['type']) // 'modality', 'access', 'licensing', ou 'capability'
        ];

        $id = $this->featureModel->create($payload);

        return [
            'success' => true,
            'message' => 'Fonctionnalité créée avec succès.',
            'data'    => $this->getFeatureById($id)
        ];
    }

    // Updates an existing feature
    public function updateFeature(int $id, array $data): array
    {
        if ($id <= 0) {
            throw new InvalidArgumentException("ID invalide.");
        }

        if (empty(trim($data['name'] ?? '')) || empty(trim($data['type'] ?? ''))) {
            throw new InvalidArgumentException("Le nom et le type sont obligatoires.");
        }

        $payload = [
            'name'        => trim($data['name']),
            'description' => !empty($data['description']) ? trim($data['description']) : null,
            'type'        => trim($data['type'])
        ];

        $updated = $this->featureModel->update($id, $payload);

        if (!$updated) {
            return [
                'success' => false,
                'message' => 'Mise à jour échouée (aucune modification ou introuvable).'
            ];
        }

        return [
            'success' => true,
            'message' => 'Fonctionnalité mise à jour avec succès.',
            'data'    => $this->getFeatureById($id)
        ];
    }

    // Deletes a feature
    public function deleteFeature(int $id): array
    {
        if ($id <= 0) {
            throw new InvalidArgumentException("ID invalide.");
        }

        $deleted = $this->featureModel->delete($id);

        if (!$deleted) {
            return [
                'success' => false,
                'message' => 'Impossible de supprimer cette fonctionnalité.'
            ];
        }

        return [
            'success' => true,
            'message' => 'Fonctionnalité supprimée avec succès.'
        ];
    }
}