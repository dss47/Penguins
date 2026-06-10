<?php

declare(strict_types=1);

final class SearchHistory extends BaseModel
{
    public function create(array $data): int
    {
        $sql = 'INSERT INTO search_histories (
                    user_id, 
                    prompt_text, 
                    search_type, 
                    title,
                    ai_reasoning
                ) VALUES (
                    :user_id, 
                    :prompt_text, 
                    :search_type, 
                    :title,
                    :ai_reasoning
                )';

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':user_id'      => (int) $data['user_id'],
            ':prompt_text'  => $data['prompt_text'],
            ':search_type'  => $data['search_type'] ?? 'keyword',
            ':title'        => $data['title'] ?? 'AI Recommendation Chat',
            ':ai_reasoning' => $data['ai_reasoning'] ?? null,
        ]);

        return (int) $this->db->lastInsertId();
    }
    public function findById(int $historyId): ?array
    {
        $sql = 'SELECT * FROM search_histories WHERE id = ? LIMIT 1';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$historyId]);
        $history = $stmt->fetch();

        return $history ?: null;
    }
    public function allByUserId(int $userId): array
    {
        $sql = 'SELECT id, title, search_type, created_at 
                FROM search_histories 
                WHERE user_id = ? 
                ORDER BY created_at DESC';

        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId]);

        return $stmt->fetchAll();
    }
}