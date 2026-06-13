<?php

declare(strict_types=1);

namespace App\Services;

use InvalidArgumentException;
use App\Models\Profession;



final class ProfessionService
{
    public function __construct(private readonly Profession $professionModel = new Profession())
    {
    }

    // Returns all professions, used to populate the registration dropdown
    public function getAllProfessions(): array
    {
        return $this->professionModel->all();
    }

    // Returns a single profession by its ID
    public function getProfessionById(int $id): ?array
    {
        if ($id <= 0) {
            return null;
        }
        
        return $this->professionModel->findById($id);
    }

    // Creates a new profession from the admin panel
    public function createProfession(array $data): array
    {
        $name = trim($data['name'] ?? '');

        if (empty($name)) {
            throw new InvalidArgumentException("Le nom de la profession est obligatoire.");
        }

        $payload = [
            'name' => $name
        ];

        $id = $this->professionModel->create($name);

        return [
            'success' => true,
            'message' => 'Profession ajoutée avec succès.',
            'data'    => $this->getProfessionById($id)
        ];
    }

    // Updates an existing profession's name
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

    // Deletes a profession (ensure no users are linked to this ID)
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