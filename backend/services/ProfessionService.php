<?php

declare(strict_types=1);

final class ProfessionService
{
    public function __construct(private readonly Profession $professionModel = new Profession())
    {
    }

    /**
     * Récupère toutes les professions.
     * Idéal pour peupler le menu déroulant lors de l'inscription (Select input).
     */
    public function getAllProfessions(): array
    {
        // On s'attend à ce que le modèle trie par ordre alphabétique (ORDER BY name ASC)
        return $this->professionModel->all();
    }

    /**
     * Récupère une profession spécifique par son ID.
     */
    public function getProfessionById(int $id): ?array
    {
        if ($id <= 0) {
            return null;
        }
        
        return $this->professionModel->findById($id);
    }

    /**
     * Ajoute une nouvelle profession depuis le panel d'administration.
     */
    public function createProfession(array $data): array
    {
        $name = trim($data['name'] ?? '');

        if (empty($name)) {
            throw new InvalidArgumentException("Le nom de la profession est obligatoire.");
        }

        $payload = [
            'name' => $name
        ];

        $id = $this->professionModel->create($payload);

        return [
            'success' => true,
            'message' => 'Profession ajoutée avec succès.',
            'data'    => $this->getProfessionById($id)
        ];
    }

    /**
     * Met à jour le nom d'une profession existante.
     */
    public function updateProfession(int $id, array $data): array
    {
        if ($id <= 0) {
            throw new InvalidArgumentException("ID de profession invalide.");
        }

        $name = trim($data['name'] ?? '');

        if (empty($name)) {
            throw new InvalidArgumentException("Le nom de la profession ne peut pas être vide.");
        }

        $payload = [
            'name' => $name
        ];

        $updated = $this->professionModel->update($id, $payload);

        if (!$updated) {
            return [
                'success' => false,
                'message' => 'Mise à jour échouée (profession introuvable ou nom identique).'
            ];
        }

        return [
            'success' => true,
            'message' => 'Profession mise à jour avec succès.',
            'data'    => $this->getProfessionById($id)
        ];
    }

    /**
     * Supprime une profession.
     * Attention : Il faut s'assurer que des utilisateurs ne sont pas déjà liés à cet ID,
     * sinon cela causera une erreur de clé étrangère (Foreign Key constraint).
     */
    public function deleteProfession(int $id): array
    {
        if ($id <= 0) {
            throw new InvalidArgumentException("ID invalide.");
        }

        $deleted = $this->professionModel->delete($id);

        if (!$deleted) {
            return [
                'success' => false,
                'message' => 'Impossible de supprimer cette profession. Des utilisateurs y sont peut-être liés.'
            ];
        }

        return [
            'success' => true,
            'message' => 'Profession supprimée avec succès.'
        ];
    }
}