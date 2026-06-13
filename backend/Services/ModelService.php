<?php

declare(strict_types=1);

namespace App\Services;

use InvalidArgumentException;
use App\Models\Model;



final class ModelService
{
    public function __construct(private readonly Model $modelModel = new Model())
    {
    }

    // Returns all AI models from the database
    public function getAllModels(): array
    {
        return $this->modelModel->all();
    }

    // Returns only the models linked to a specific provider (for dependent dropdowns)
    public function getModelsByProvider(int $providerId): array
    {
        if ($providerId <= 0) {
            return [];
        }

        return $this->modelModel->allByProviderId($providerId);
    }

    // Returns a single model by its ID
    public function getModelById(int $id): ?array
    {
        if ($id <= 0) {
            return null;
        }
        
        return $this->modelModel->findById($id);
    }

    // Creates a new AI model (Admin Panel)
    public function createModel(array $data): array
    {
        if (empty(trim($data['name'] ?? ''))) {
            throw new InvalidArgumentException("Le nom du modèle est obligatoire.");
        }

        if (empty($data['provider_id'])) {
            throw new InvalidArgumentException("Un modèle doit obligatoirement être rattaché à un fournisseur (provider_id).");
        }

        $payload = [
            'provider_id' => (int) $data['provider_id'],
            'name'        => trim($data['name']),
            'description' => !empty($data['description']) ? trim($data['description']) : null,
            'status'      => $data['status'] ?? 'active'
        ];

        $id = $this->modelModel->create($payload);

        return [
            'success' => true,
            'message' => 'Modèle créé avec succès.',
            'data'    => $this->getModelById($id)
        ];
    }

    // Updates an existing model (partial update supported)
    public function updateModel(int $id, array $data): array
    {
        if ($id <= 0) {
            throw new InvalidArgumentException("ID de modèle invalide.");
        }

        $payload = [];
        
        if (isset($data['provider_id'])) {
            $payload['provider_id'] = (int) $data['provider_id'];
        }
        if (isset($data['name'])) {
            $payload['name'] = trim($data['name']);
        }
        if (isset($data['description'])) {
            $payload['description'] = trim($data['description']);
        }
        if (isset($data['status'])) {
            $payload['status'] = trim($data['status']);
        }

        $updated = $this->modelModel->update($id, $payload);

        if (!$updated) {
            return [
                'success' => false,
                'message' => 'La mise à jour a échoué (le modèle n\'existe pas ou aucune modification détectée).'
            ];
        }

        return [
            'success' => true,
            'message' => 'Modèle mis à jour avec succès.',
            'data'    => $this->getModelById($id)
        ];
    }

    // Deletes a model
    public function deleteModel(int $id): array
    {
        if ($id <= 0) {
            throw new InvalidArgumentException("ID invalide.");
        }

        $deleted = $this->modelModel->delete($id);

        if (!$deleted) {
            return [
                'success' => false,
                'message' => 'Impossible de supprimer ce modèle.'
            ];
        }

        return [
            'success' => true,
            'message' => 'Modèle supprimé avec succès.'
        ];
    }
}