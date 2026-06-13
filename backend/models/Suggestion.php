<?php

declare(strict_types=1);

final class Suggestion extends BaseModel
{
    // Returns all suggestions with a given status
    public function allByStatus(string $status): array
    {
        $sql = 'SELECT * FROM suggestions WHERE status = ? ORDER BY created_at DESC';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$status]);
        
        return $stmt->fetchAll();
    }

    // Finds a suggestion by its ID
    public function findById(int $id): ?array
    {
        $sql = 'SELECT * FROM suggestions WHERE id = ? LIMIT 1';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        $suggestion = $stmt->fetch();
        
        return $suggestion ?: null;
    }

    // Creates a new suggestion record and returns its ID
    public function create(array $data): int
    {
        $sql = 'INSERT INTO suggestions (
                    user_id, category_id, provider_id, model_id, model_ids, name, logo_url, website_url, 
                    description, existing_feature_ids, release_date, 
                    why_this_tool, status, rejection_reason, ai_moderation_notes
                ) VALUES (
                    :user_id, :category_id, :provider_id, :model_id, :model_ids, :name, :logo_url, :website_url, 
                    :description, :existing_feature_ids, :release_date, 
                    :why_this_tool, :status, :rejection_reason, :ai_moderation_notes
                )';

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':user_id'                 => (int) $data['user_id'],
            ':category_id'             => (int) $data['category_id'],
            ':provider_id'             => $data['provider_id'] ?? null,
            ':model_id'                => $data['model_id'] ?? null,
            ':model_ids'               => $data['model_ids'] ?? null,
            ':name'                    => $data['name'],
            ':logo_url'                => $data['logo_url'] ?? null,
            ':website_url'             => $data['website_url'] ?? null,
            ':description'             => $data['description'] ?? null,
            ':existing_feature_ids'    => $data['existing_feature_ids'] ?? null,
            ':release_date'            => $data['release_date'] ?? null,
            ':why_this_tool'           => $data['why_this_tool'] ?? null,
            ':status'                  => $data['status'] ?? 'waiting_ai_analysis',
            ':rejection_reason'        => $data['rejection_reason'] ?? null,
            ':ai_moderation_notes'     => $data['ai_moderation_notes'] ?? null,
        ]);

        return (int) $this->db->lastInsertId();
    }

    // Updates a suggestion's status, rejection reason, and optionally links it to a published tool
    public function updateStatus(int $id, string $status, ?string $rejectionReason = null, ?int $toolId = null): bool
    {
        $sql = 'UPDATE suggestions SET status = :status, rejection_reason = :rejection_reason, tool_id = :tool_id WHERE id = :id';
        $stmt = $this->db->prepare($sql);
        
        return $stmt->execute([
            ':status'           => $status,
            ':rejection_reason' => $rejectionReason,
            ':tool_id'          => $toolId,
            ':id'               => $id
        ]);
    }

    // Updates a suggestion with AI validation results (corrected fields, rating, notes)
    public function updateFromAiValidation(int $id, array $aiData): bool
    {
        $sql = 'UPDATE suggestions SET 
                    status = :status, 
                    rejection_reason = :rejection_reason,
                    ai_moderation_notes = :ai_moderation_notes,
                    fixed_name = :fixed_name,
                    fixed_url = :fixed_url,
                    fixed_category_id = :fixed_category_id,
                    fixed_provider_id = :fixed_provider_id,
                    fixed_model_id = :fixed_model_id,
                    fixed_model_ids = :fixed_model_ids,
                    fixed_feature_ids = :fixed_feature_ids,
                    fixed_release_date = :fixed_release_date,
                    ai_global_rating = :ai_global_rating
                WHERE id = :id';
                
        $stmt = $this->db->prepare($sql);
        
        return $stmt->execute([
            ':status'               => $aiData['status'],
            ':rejection_reason'     => $aiData['rejection_reason'] ?? null,
            ':ai_moderation_notes'  => $aiData['ai_moderation_notes'] ?? null,
            ':fixed_name'           => $aiData['fixed_name'] ?? null,
            ':fixed_url'            => $aiData['fixed_url'] ?? null,
            ':fixed_category_id'    => $aiData['fixed_category_id'] ?? null,
            ':fixed_provider_id'    => $aiData['fixed_provider_id'] ?? null,
            ':fixed_model_id'       => $aiData['fixed_model_id'] ?? null,
            ':fixed_model_ids'      => isset($aiData['fixed_model_ids']) ? (is_array($aiData['fixed_model_ids']) ? json_encode($aiData['fixed_model_ids']) : $aiData['fixed_model_ids']) : null,
            ':fixed_feature_ids'    => isset($aiData['fixed_feature_ids']) ? (is_array($aiData['fixed_feature_ids']) ? implode(',', $aiData['fixed_feature_ids']) : $aiData['fixed_feature_ids']) : null,
            ':fixed_release_date'   => $aiData['fixed_release_date'] ?? null,
            ':ai_global_rating'     => $aiData['global_rating'] ?? null,
            ':id'                   => $id
        ]);
    }

    // Returns all suggestions submitted by a specific user
    public function allByUserId(int $userId): array
    {
        $sql = 'SELECT * FROM suggestions WHERE user_id = ? ORDER BY created_at DESC';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId]);
        return $stmt->fetchAll();
    }

    // Returns the suggestion history for a specific admin user
    public function getAdminHistory(int $adminUserId): array
    {
        $sql = 'SELECT * FROM suggestions 
                WHERE user_id = :admin_id 
                ORDER BY created_at DESC';
                
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':admin_id' => $adminUserId]);
        
        return $stmt->fetchAll();
    }

    // Updates allowed fields of a suggestion
    public function update(int $id, array $data): bool
    {
        $allowedFields = ['name', 'website_url', 'description', 'category_id', 'provider_id',
                          'model_ids', 'existing_feature_ids', 'release_date', 'logo_url',
                          'fixed_name', 'fixed_url', 'fixed_description', 'fixed_category_id', 'fixed_provider_id',
                          'fixed_model_ids', 'fixed_feature_ids', 'fixed_release_date'];
        $sets = [];
        $params = [':id' => $id];
        foreach ($data as $field => $value) {
            if (in_array($field, $allowedFields, true)) {
                $sets[] = "`{$field}` = :{$field}";
                $params[":{$field}"] = $value;
            }
        }
        if (empty($sets)) return false;
        $sql = 'UPDATE suggestions SET ' . implode(', ', $sets) . ' WHERE id = :id';
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }

    // Deletes a suggestion by its ID
    public function delete(int $id): bool
    {
        $sql = 'DELETE FROM suggestions WHERE id = :id';
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([':id' => $id]);
    }
}