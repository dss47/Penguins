<?php

declare(strict_types=1);

final class ModelService
{
    public function __construct(private readonly Model $modelModel = new Model())
    {
    }

    /**
     * Récupère tous les modèles d'IA de la base de données.
     * Idéalement avec une jointure SQL dans le modèle pour ramener le nom du provider.
     */
    public function getAllModels(): array
    {
        return $this->modelModel->all();
    }

    /**
     * ASTUCE FRONTEND : Récupère uniquement les modèles liés à un fournisseur précis.
     * Parfait pour les formulaires avec des menus déroulants liés/dépendants.
     */
    public function getModelsByProvider(int $providerId): array
    {
        if ($providerId <= 0) {
            return [];
        }

        // Suppose que votre classe Model possède une méthode `findByProviderId`
        return $this->modelModel->findByProviderId($providerId);
    }

    /**
     * Récupère un modèle spécifique par son ID.
     */
    public function getModelById(int $id): ?array
    {
        if ($id <= 0) {
            return null;
        }
        
        return $this->modelModel->findById($id);
    }

    /**
     * Ajoute un nouveau modèle d'IA (Admin Panel).
     */
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

    /**
     * Met à jour un modèle existant.
     */
    public function updateModel(int $id, array $data): array
    {
        if ($id <= 0) {
            throw new InvalidArgumentException("ID de modèle invalide.");
        }

        // On ne met à jour que les champs envoyés (mise à jour partielle possible)
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

    /**
     * Supprime un modèle.
     */
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