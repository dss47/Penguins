<?php

declare(strict_types=1);

final class Review extends BaseModel
{
    public function create(array $data): int
    {
        $sql = 'INSERT INTO reviews (
                    user_id, 
                    tool_id, 
                    comment, 
                    rating, 
                    status
                ) VALUES (
                    :user_id, 
                    :tool_id, 
                    :comment, 
                    :rating, 
                    :status
                )';

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':user_id' => (int) $data['user_id'],
            ':tool_id' => (int) $data['tool_id'],
            ':comment' => $data['comment'] ?? null,
            ':rating'  => (int) $data['rating'],
            ':status'  => $data['status'] ?? 'pending',
        ]);

        return (int) $this->db->lastInsertId();
    }

    public function updateModeration(int $reviewId, string $status, ?string $aiFlagReason = null): bool
    {
        $sql = 'UPDATE reviews 
                SET status = :status, ai_flag_reason = :ai_flag_reason 
                WHERE id = :id';
                
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':status'         => $status,
            ':ai_flag_reason' => $aiFlagReason,
            ':id'             => $reviewId
        ]);
    }

    public function allApprovedByToolId(int $toolId): array
    {
        $sql = 'SELECT r.*, u.name AS user_name 
                FROM reviews r
                INNER JOIN users u ON r.user_id = u.id
                WHERE r.tool_id = ? AND r.status = \'approved\'
                ORDER BY r.created_at DESC';

        $stmt = $this->db->prepare($sql);
        $stmt->execute([$toolId]);

        return $stmt->fetchAll();
    }
    public function allByStatus(string $status): array
    {
        $sql = 'SELECT r.*, t.name AS tool_name, u.name AS user_name 
                FROM reviews r
                INNER JOIN ai_tools t ON r.tool_id = t.id
                INNER JOIN users u ON r.user_id = u.id
                WHERE r.status = ?
                ORDER BY r.created_at ASC';

        $stmt = $this->db->prepare($sql);
        $stmt->execute([$status]);

        return $stmt->fetchAll();
    }
}