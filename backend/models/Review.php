<?php

declare(strict_types=1);

final class Review extends BaseModel
{
    // Creates a new review and returns its ID
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

    // Updates the moderation status and AI flag reason for a review
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

    // Returns all approved reviews for a given tool, with user and profession info
    public function allApprovedByToolId(int $toolId): array
    {
        $sql = 'SELECT r.*, u.name AS user_name, p.name AS profession_name
                FROM reviews r
                INNER JOIN users u ON r.user_id = u.id
                LEFT JOIN professions p ON u.profession_id = p.id
                WHERE r.tool_id = ? AND r.status = \'approved\' AND r.comment IS NOT NULL
                ORDER BY r.created_at DESC';

        $stmt = $this->db->prepare($sql);
        $stmt->execute([$toolId]);

        return $stmt->fetchAll();
    }

    // Returns the top-rated approved comments across all tools, with user and tool details
    public function topApprovedComments(int $limit = 3): array
    {
        $limit = max(1, min(10, $limit));

        $sql = "SELECT r.id,
                       r.comment,
                       r.rating,
                       r.created_at,
                       u.name AS user_name,
                       u.profile_url AS user_profile_url,
                       p.name AS profession_name,
                       t.name AS tool_name
                FROM reviews r
                INNER JOIN users u ON r.user_id = u.id
                INNER JOIN ai_tools t ON r.tool_id = t.id
                LEFT JOIN professions p ON u.profession_id = p.id
                WHERE r.status = 'approved'
                  AND r.comment IS NOT NULL
                  AND TRIM(r.comment) <> ''
                ORDER BY r.rating DESC, r.created_at DESC
                LIMIT $limit";

        $stmt = $this->db->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    // Finds a single review by user ID and tool ID combination
    public function findByUserAndTool(int $userId, int $toolId): ?array
    {
        $sql = 'SELECT r.*, u.name AS user_name, p.name AS profession_name
                FROM reviews r
                INNER JOIN users u ON r.user_id = u.id
                LEFT JOIN professions p ON u.profession_id = p.id
                WHERE r.user_id = ? AND r.tool_id = ?
                LIMIT 1';

        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId, $toolId]);

        $result = $stmt->fetch();
        return $result ?: null;
    }

    // Updates an existing review's comment, rating, status, and flag reason
    public function update(int $id, array $data): bool
    {
        $sql = 'UPDATE reviews 
                SET comment = :comment, rating = :rating, status = :status, 
                    ai_flag_reason = :ai_flag_reason, updated_at = NOW()
                WHERE id = :id';

        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':comment'         => $data['comment'] ?? null,
            ':rating'          => (int) $data['rating'],
            ':status'          => $data['status'] ?? 'pending',
            ':ai_flag_reason'  => $data['ai_flag_reason'] ?? null,
            ':id'              => $id,
        ]);
    }

    // Returns all reviews filtered by moderation status, with tool and user info
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

    // Finds a single review by its ID with tool, user, and profession info
    public function findById(int $id): ?array
    {
        $sql = 'SELECT r.*, t.name AS tool_name, u.name AS user_name, p.name AS profession_name
                FROM reviews r
                INNER JOIN ai_tools t ON r.tool_id = t.id
                INNER JOIN users u ON r.user_id = u.id
                LEFT JOIN professions p ON u.profession_id = p.id
                WHERE r.id = ?';

        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);

        $result = $stmt->fetch();
        return $result ?: null;
    }

    // Deletes a review by its ID
    public function delete(int $id): bool
    {
        $sql = 'DELETE FROM reviews WHERE id = ?';
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([$id]);
    }

    // Returns all reviews submitted by a specific user, with tool info
    public function allByUserId(int $userId): array
    {
        $sql = 'SELECT r.*, t.name AS tool_name, t.logo_url AS tool_logo
                FROM reviews r
                INNER JOIN ai_tools t ON r.tool_id = t.id
                WHERE r.user_id = ?
                ORDER BY r.created_at DESC';

        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId]);

        return $stmt->fetchAll();
    }

    // Deletes all reviews submitted by a specific user (used during account deletion)
    public function deleteAllByUserId(int $userId): bool
    {
        $sql = 'DELETE FROM reviews WHERE user_id = ?';
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([$userId]);
    }
}
