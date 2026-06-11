<?php

declare(strict_types=1);

final class ProviderService
{
    public function __construct(private readonly Provider $providerModel = new Provider())
    {
    }

    /**
     * Récupère tous les fournisseurs.
     * Utilisé pour remplir les listes déroulantes (Select) dans les formulaires.
     */
    public function getAllProviders(): array
    {
        return $this->providerModel->all();
    }

    /**
     * Récupère un fournisseur spécifique par son ID.
     */
    public function getProviderById(int $id): ?array
    {
        if ($id <= 0) {
            return null;
        }
        
        return $this->providerModel->findById($id);
    }

    /**
     * ASTUCE FRONTEND : Récupère un fournisseur ET la liste de ses modèles.
     * Parfait pour une page du type : /providers/1 (Page profil d'OpenAI affichant GPT-4, GPT-3.5, etc.)
     */
    public function getProviderWithModels(int $id): ?array
    {
        if ($id <= 0) {
            return null;
        }

        $provider = $this->providerModel->findById($id);

        if (!$provider) {
            return null;
        }

        // Suppose que votre classe Provider possède une méthode `getModelsByProviderId`
        // ou que vous utilisez un JOIN SQL. Si ce n'est pas le cas, vous pouvez 
        // injecter le ModelService ici pour faire la liaison !
        $provider['models'] = $this->providerModel->getModelsByProviderId($id) ?? [];

        return $provider;
    }

    /**
     * Crée un nouveau fournisseur (Admin Panel).
     */
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

        // Optionnel : Validation basique de l'URL si elle est fournie
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

    /**
     * Met à jour un fournisseur existant.
     */
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

    /**
     * Supprime un fournisseur.
     */
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