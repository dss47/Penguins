<?php

declare(strict_types=1);

namespace App\Services;

use InvalidArgumentException;
use App\Models\Provider;



final class ProviderService
{
    public function __construct(private readonly Provider $providerModel = new Provider())
    {
    }

    // Returns all providers, used to populate dropdown select inputs in forms
    public function getAllProviders(): array
    {
        return $this->providerModel->all();
    }

    // Returns a single provider by its ID
    public function getProviderById(int $id): ?array
    {
        if ($id <= 0) {
            return null;
        }
        
        return $this->providerModel->findById($id);
    }

    // Returns a provider with its associated models (e.g., for a provider profile page)
    public function getProviderWithModels(int $id): ?array
    {
        if ($id <= 0) {
            return null;
        }

        $provider = $this->providerModel->findById($id);

        if (!$provider) {
            return null;
        }

        $provider['models'] = [];

        return $provider;
    }

    // Creates a new provider (Admin Panel)
    public function createProvider(array $data): array
    {
        if (empty(trim($data['name'] ?? ''))) {
            throw new InvalidArgumentException("Le nom du fournisseur est obligatoire.");
        }

        $payload = [
            'name'        => trim($data['name']),
            'website_url' => !empty($data['website_url']) ? trim($data['website_url']) : null,
            'description' => !empty($data['description']) ? trim($data['description']) : null
        ];

        if ($payload['website_url'] && !filter_var($payload['website_url'], FILTER_VALIDATE_URL)) {
            throw new InvalidArgumentException("L'URL du site web n'est pas valide.");
        }

        $id = $this->providerModel->create($payload);

        return [
            'success' => true,
            'message' => 'Fournisseur ajouté avec succès.',
            'data'    => $this->getProviderById($id)
        ];
    }

    // Updates an existing provider
    public function updateProvider(int $id, array $data): array
    {
        if ($id <= 0) {
            throw new InvalidArgumentException("ID de fournisseur invalide.");
        }

        if (empty(trim($data['name'] ?? ''))) {
            throw new InvalidArgumentException("Le nom du fournisseur ne peut pas être vide.");
        }

        $payload = [
            'name'        => trim($data['name']),
            'website_url' => !empty($data['website_url']) ? trim($data['website_url']) : null,
            'description' => !empty($data['description']) ? trim($data['description']) : null
        ];

        if ($payload['website_url'] && !filter_var($payload['website_url'], FILTER_VALIDATE_URL)) {
            throw new InvalidArgumentException("L'URL du site web n'est pas valide.");
        }

        $updated = $this->providerModel->update($id, $payload);

        if (!$updated) {
            return [
                'success' => false,
                'message' => 'La mise à jour a échoué (le fournisseur n\'existe pas ou aucune modification détectée).'
            ];
        }

        return [
            'success' => true,
            'message' => 'Fournisseur mis à jour avec succès.',
            'data'    => $this->getProviderById($id)
        ];
    }

    // Deletes a provider
    public function deleteProvider(int $id): array
    {
        if ($id <= 0) {
            throw new InvalidArgumentException("ID invalide.");
        }

        $deleted = $this->providerModel->delete($id);

        if (!$deleted) {
            return [
                'success' => false,
                'message' => 'Impossible de supprimer ce fournisseur. Des modèles y sont peut-être liés.'
            ];
        }

        return [
            'success' => true,
            'message' => 'Fournisseur supprimé avec succès.'
        ];
    }
}