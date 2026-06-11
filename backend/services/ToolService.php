<?php

declare(strict_types=1);

final class ToolService
{
    public function __construct(private readonly AiTool $toolModel = new AiTool()) {}

    public function listTools(): array
    {
        return $this->toolModel->all() ?? [];
    }

    public function validateToolData(array $payload): array
    {
        $errors = [];

        if (empty($payload['name'])) {
            $errors['name'] = 'Le nom de l\'outil est requis.';
        }

        if (empty($payload['category_id']) || !is_numeric($payload['category_id'])) {
            $errors['category_id'] = 'Une catégorie valide est requise.';
        }

        if (empty($payload['provider_id']) || !is_numeric($payload['provider_id'])) {
            $errors['provider_id'] = 'Un fournisseur valide est requis.';
        }

        if (empty($payload['website_url']) || !filter_var($payload['website_url'], FILTER_VALIDATE_URL)) {
            $errors['website_url'] = 'Une URL du site web valide est requise.';
        }

        if (!empty($payload['logo_url'])) {
            $isUrl = filter_var($payload['logo_url'], FILTER_VALIDATE_URL);
            $isLocalPath = str_starts_with($payload['logo_url'], '/uploads/');
            
            if (!$isUrl && !$isLocalPath) {
                $errors['logo_url'] = 'Une URL du logo valide ou un chemin local est requis.';
            }
        }

        if (isset($payload['website_rating']) && $payload['website_rating'] !== '' && !is_numeric($payload['website_rating'])) {
            $errors['website_rating'] = 'Une note locale valide est requise.';
        }

        if (!empty($payload['release_date'])) {
            $date = DateTime::createFromFormat('Y-m-d', $payload['release_date']);
            if (!$date || $date->format('Y-m-d') !== $payload['release_date']) {
                $errors['release_date'] = 'La date de sortie doit être au format YYYY-MM-DD.';
            }
        }

        if (empty($payload['status']) || !in_array($payload['status'], ['pending', 'active', 'archived', 'deprecated'])) {
            $errors['status'] = 'Un statut valide est requis.';
        }

        return $errors;
    }


    public function createTool(array $payload, int $userId): array
    {
        $errors = $this->validateToolData($payload);

        if (!empty($errors)) {
            return ['success' => false, 'errors' => $errors];
        }

        $payload['created_by'] = $userId;

        $toolId = $this->toolModel->create($payload);

        if ($toolId) {
            return ['success' => true, 'id' => $toolId];
        }

        return ['success' => false, 'errors' => ['general' => 'Erreur lors de la création de l\'outil.']];
    }

    public function getToolDetails(int $id): array
    {
        $tool = $this->toolModel->findById($id);

        if (!$tool) {
            return ['success' => false, 'error' => 'Outil introuvable.'];
        }

        return ['success' => true, 'data' => $tool];
    }

    public function updateToolStatus(int $id, string $newStatus): array
    {
        $validStatuses = ['pending', 'active', 'archived', 'deprecated'];
        if (!in_array($newStatus, $validStatuses, true)) {
            return ['success' => false, 'error' => 'Statut invalide.'];
        }

        $success = $this->toolModel->updateStatus($id, $newStatus);

        if ($success) {
            return ['success' => true];
        }

        return ['success' => false, 'error' => 'Erreur lors de la mise à jour du statut.'];
    }

    public function updateTool(int $id, array $payload): array
    {
        $errors = $this->validateToolData($payload);

        if (!empty($errors)) {
            return ['success' => false, 'errors' => $errors];
        }

        $success = $this->toolModel->update($id, $payload);

        if ($success) {
            return ['success' => true];
        }

        return ['success' => false, 'errors' => ['general' => 'Erreur lors de la mise à jour de l\'outil.']];
    }
}
