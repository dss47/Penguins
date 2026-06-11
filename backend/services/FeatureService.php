<?php

declare(strict_types=1);

final class FeatureService
{
    public function __construct(private readonly Feature $featureModel = new Feature())
    {
    }

    /**
     * Récupère toutes les fonctionnalités sous forme de liste simple.
     */
    public function getAllFeatures(): array
    {
        return $this->featureModel->all();
    }

    /**
     * ASTUCE FRONTEND : Récupère les fonctionnalités et les regroupe par "type".
     * Idéal pour React : permet de générer des sections distinctes de checkboxes
     * (ex: une section "Licence", une section "Accès", etc.)
     */
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

    /**
     * Récupère une fonctionnalité spécifique par son ID.
     */
    public function getFeatureById(int $id): ?array
    {
        if ($id <= 0) {
            return null;
        }
        
        return $this->featureModel->findById($id);
    }

    /**
     * Crée une nouvelle fonctionnalité (Admin Panel).
     */
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

    /**
     * Met à jour une fonctionnalité existante.
     */
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

    /**
     * Supprime une fonctionnalité.
     */
    public function deleteFeature(int $id): array
    {
        if ($id <= 0) {
            throw new InvalidArgumentException("ID invalide.");
        }

        // Le modèle devraitidéalement supprimer aussi les liaisons dans la table pivot (tool_features)
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