<?php

declare(strict_types=1);

final class Suggestion extends BaseModel
{
    public function allByStatus(string $status): array
    {
        $sql = 'SELECT * FROM suggestions WHERE status = ? ORDER BY created_at DESC';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$status]);
        
        return $stmt->fetchAll();
    }
    public function findById(int $id): ?array
    {
        $sql = 'SELECT * FROM suggestions WHERE id = ? LIMIT 1';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        $suggestion = $stmt->fetch();
        
        return $suggestion ?: null;
    }
    public function create(array $data): int
    {
        $sql = 'INSERT INTO suggestions (
                    user_id, category_id, provider_id, model_id, name, website_url, 
                    description, proposed_provider_name, proposed_model_name, 
                    proposed_new_features, existing_feature_ids, release_date, 
                    why_this_tool, status, rejection_reason
                ) VALUES (
                    :user_id, :category_id, :provider_id, :model_id, :name, :website_url, 
                    :description, :proposed_provider_name, :proposed_model_name, 
                    :proposed_new_features, :existing_feature_ids, :release_date, 
                    :why_this_tool, :status, :rejection_reason
                )';

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':user_id'                 => (int) $data['user_id'],
            ':category_id'             => (int) $data['category_id'],
            ':provider_id'             => $data['provider_id'] ?? null,
            ':model_id'                => $data['model_id'] ?? null,
            ':name'                    => $data['name'],
            ':website_url'             => $data['website_url'] ?? null,
            ':description'             => $data['description'] ?? null,
            ':proposed_provider_name'  => $data['proposed_provider_name'] ?? null,
            ':proposed_model_name'     => $data['proposed_model_name'] ?? null,
            ':proposed_new_features'   => $data['proposed_new_features'] ?? null,
            ':existing_feature_ids'    => $data['existing_feature_ids'] ?? null,
            ':release_date'            => $data['release_date'] ?? null,
            ':why_this_tool'           => $data['why_this_tool'] ?? null,
            ':status'                  => $data['status'] ?? 'pending_ai',
            ':rejection_reason'        => $data['rejection_reason'] ?? null,
        ]);

        return (int) $this->db->lastInsertId();
    }

    public function updateStatus(int $id, string $status, ?string $rejectionReason = null): bool
    {
        $sql = 'UPDATE suggestions SET status = :status, rejection_reason = :rejection_reason WHERE id = :id';
        $stmt = $this->db->prepare($sql);
        
        return $stmt->execute([
            ':status'           => $status,
            ':rejection_reason' => $rejectionReason,
            ':id'               => $id
        ]);
    }
}