<?php

declare(strict_types=1);

namespace App\Services;

use PDO;
use PDOException;
use DateTime;
use App\Models\AiTool;
use App\Models\ToolFeatures;
use App\Models\ToolModel;
use App\Services\ToolService;



final class ToolService
{
    public function __construct(
        private readonly AiTool $toolModel = new AiTool(),
        private readonly ToolFeatures $toolFeatures = new ToolFeatures()
    ) {}

    // Returns all tools from the database
    public function listTools(): array
    {
        return $this->toolModel->all() ?? [];
    }

    // Returns all tools with category and provider names, ordered by creation date
    public function listAllToolsWithDetails(): array
    {
        $db = db_connection();
        $sql = "SELECT t.*,
                       c.name AS category_name,
                       p.name AS provider_name
                FROM ai_tools t
                LEFT JOIN categories c ON t.category_id = c.id
                LEFT JOIN providers p ON t.provider_id = p.id
                ORDER BY t.created_at DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    // Returns only active tools with category/provider names and their feature list
    public function listPublicTools(): array
    {
        $db = db_connection();
        $sql = "SELECT t.*,
                       c.name AS category_name,
                       p.name AS provider_name
                FROM ai_tools t
                LEFT JOIN categories c ON t.category_id = c.id
                LEFT JOIN providers p ON t.provider_id = p.id
                WHERE t.status = 'active'
                ORDER BY t.created_at DESC";
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $tools = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

        foreach ($tools as &$tool) {
            $features = $this->toolFeatures->findFeaturesByToolId((int) $tool['id']);
            $tool['features'] = array_column($features, 'name');
        }

        return $tools;
    }

    // Returns detailed data for a single active tool by its name, including features, models, and similar tools
    public function getPublicToolByName(string $name): array
    {
        $db = db_connection();
        $sql = "SELECT t.*,
                       c.name AS category_name,
                       p.name AS provider_name,
                       uc.name AS created_by_name,
                       uv.name AS validated_by_name
                FROM ai_tools t
                LEFT JOIN categories c ON t.category_id = c.id
                LEFT JOIN providers p ON t.provider_id = p.id
                LEFT JOIN users uc ON t.created_by = uc.id
                LEFT JOIN users uv ON t.validated_by = uv.id
                WHERE t.name = ? AND t.status = 'active'
                LIMIT 1";
        $stmt = $db->prepare($sql);
        $stmt->execute([$name]);
        $tool = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$tool) {
            return ['success' => false, 'error' => 'Outil introuvable.'];
        }

        $features = $this->toolFeatures->findFeaturesByToolId((int) $tool['id']);
        $tool['features'] = array_column($features, 'name');

        $tm = new ToolModel();
        $models = $tm->findModelsByToolId((int) $tool['id']);
        $tool['models'] = array_column($models, 'name');

        $tool['similar_tools'] = $this->findSimilarTools((int) $tool['category_id'], (int) $tool['id']);

        return ['success' => true, 'data' => $tool];
    }

    // Finds up to $limit tools in the same category, excluding the given tool ID
    private function findSimilarTools(int $categoryId, int $excludeId, int $limit = 6): array
    {
        $db = db_connection();
        $sql = "SELECT name, logo_url FROM ai_tools
                WHERE category_id = ? AND id != ? AND status = 'active'
                LIMIT ?";
        $stmt = $db->prepare($sql);
        $stmt->execute([$categoryId, $excludeId, $limit]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    // Validates tool creation/update payload fields, returns an array of error messages
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
            $isLocalPath = str_starts_with($payload['logo_url'], '/public/uploads/')
                || str_starts_with($payload['logo_url'], '/uploads/');
            
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


    // Validates and creates a new tool, returns the new tool ID on success
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

    // Retrieves a single tool by its ID
    public function getToolDetails(int $id): array
    {
        $tool = $this->toolModel->findById($id);

        if (!$tool) {
            return ['success' => false, 'error' => 'Outil introuvable.'];
        }

        return ['success' => true, 'data' => $tool];
    }

    // Updates the status of a tool (pending, active, archived, deprecated)
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

    // Deletes a tool and all its related data (models, features, favorites, reviews, etc.) in a transaction
    public function deleteTool(int $id): array
    {
        $db = db_connection();
        try {
            $db->beginTransaction();

            $db->prepare('DELETE FROM tool_models WHERE tool_id = ?')->execute([$id]);
            $db->prepare('DELETE FROM tool_features WHERE tool_id = ?')->execute([$id]);
            $db->prepare('DELETE FROM favorite_items WHERE tool_id = ?')->execute([$id]);
            $db->prepare('DELETE FROM shelf_items WHERE tool_id = ?')->execute([$id]);
            $db->prepare('DELETE FROM reviews WHERE tool_id = ?')->execute([$id]);
            $db->prepare('DELETE FROM search_history_tools WHERE tool_id = ?')->execute([$id]);
            $db->prepare('UPDATE suggestions SET tool_id = NULL WHERE tool_id = ?')->execute([$id]);
            $this->toolModel->delete($id);

            $db->commit();
            return ['success' => true];
        } catch (\PDOException $e) {
            $db->rollBack();
            return ['success' => false, 'error' => 'Erreur lors de la suppression: ' . $e->getMessage()];
        }
    }

    // Validates and updates an existing tool's data
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
