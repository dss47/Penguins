<?php

declare(strict_types=1);

final class AdminService
{
    private PDO $db;

    public function __construct()
    {
        $this->db = db_connection();
    }

    // Returns aggregated stats, recent activity, and category distribution for the admin dashboard
    public function getDashboardData(): array
    {
        $stats = [
            'users' => (int) $this->db->query("SELECT COUNT(*) FROM users")->fetchColumn(),
            'active_ai_tools' => (int) $this->db->query("SELECT COUNT(*) FROM ai_tools WHERE status = 'active'")->fetchColumn(),
            'pending_manager_suggestions' => (int) $this->db->query("SELECT COUNT(*) FROM suggestions WHERE status = 'waiting_manual_validation' OR status = 'ai_approved_pending_review'")->fetchColumn(),
            'flagged_reviews' => (int) $this->db->query("SELECT COUNT(*) FROM reviews WHERE status = 'flagged'")->fetchColumn(),
        ];

        $activityQuery = "
            (SELECT id, 'suggestion' as type, status, created_at FROM suggestions ORDER BY created_at DESC LIMIT 5)
            UNION ALL
            (SELECT id, 'review' as type, status, created_at FROM reviews WHERE status = 'flagged' ORDER BY created_at DESC LIMIT 5)
            ORDER BY created_at DESC LIMIT 10
        ";
        $activity = $this->db->query($activityQuery)->fetchAll();

        $categoriesQuery = "
            SELECT c.name, COUNT(t.id) as tool_count 
            FROM categories c 
            LEFT JOIN ai_tools t ON c.id = t.category_id 
            GROUP BY c.id, c.name
        ";
        $categories = $this->db->query($categoriesQuery)->fetchAll();

        return [
            'stats' => $stats,
            'activity' => $activity,
            'categories' => $categories,
        ];
    }

    // Returns all users with basic info, ordered by creation date
    public function getUsers(): array
    {
        return $this->db->query("SELECT id, name, email, role, status, DATE_FORMAT(created_at, '%d %b %Y') as joined FROM users ORDER BY created_at DESC")->fetchAll(PDO::FETCH_ASSOC);
    }

    // Updates the role of a user (e.g., promote to admin, demote to user)
    public function updateUserRole(int $userId, string $role): bool
    {
        $stmt = $this->db->prepare("UPDATE users SET role = ? WHERE id = ?");
        return $stmt->execute([$role, $userId]);
    }

    // Updates the status of a user (e.g., ban, unban, suspend)
    public function updateUserStatus(int $userId, string $status): bool
    {
        $stmt = $this->db->prepare("UPDATE users SET status = ? WHERE id = ?");
        return $stmt->execute([$status, $userId]);
    }

    // Returns all suggestions with author and category/provider/model info, resolves feature names
    public function getSuggestions(): array
    {
        $features = $this->db->query("SELECT id, name FROM features")
                             ->fetchAll(PDO::FETCH_KEY_PAIR);
        $models   = $this->db->query("SELECT id, name FROM models")
                             ->fetchAll(PDO::FETCH_KEY_PAIR);

        $query = "
            SELECT s.*,
                   u.name AS author_name, u.email AS author_email,
                   c.name AS category_name,
                   fc.name AS fixed_category_name,
                   p.name AS provider_name,
                   fp.name AS fixed_provider_name,
                   m.name AS model_name,
                   fm.name AS fixed_model_name
            FROM suggestions s
            LEFT JOIN users u ON s.user_id = u.id
            LEFT JOIN categories c ON s.category_id = c.id
            LEFT JOIN categories fc ON s.fixed_category_id = fc.id
            LEFT JOIN providers p ON s.provider_id = p.id
            LEFT JOIN providers fp ON s.fixed_provider_id = fp.id
            LEFT JOIN models m ON s.model_id = m.id
            LEFT JOIN models fm ON s.fixed_model_id = fm.id
            ORDER BY s.created_at DESC
        ";
        $suggestions = $this->db->query($query)->fetchAll(PDO::FETCH_ASSOC);

        foreach ($suggestions as &$s) {
            $resolveIds = function (string $field) use ($features, $s): array {
                if (empty($s[$field])) return [];
                $ids = explode(',', $s[$field]);
                return array_values(array_filter(
                    array_map(fn($id) => $features[(int) $id] ?? null, $ids)
                ));
            };
            $s['existing_feature_names'] = $resolveIds('existing_feature_ids');
            $s['fixed_feature_names']    = $resolveIds('fixed_feature_ids');

            $resolveModelIds = function (string $field) use ($models, $s): array {
                if (empty($s[$field])) return [];
                $raw = $s[$field];
                $ids = is_array($raw) ? $raw : (
                    str_starts_with((string) $raw, '[') ? (json_decode((string) $raw, true) ?? []) : explode(',', (string) $raw)
                );
                return array_values(array_filter(
                    array_map(fn($id) => $models[(int) $id] ?? null, $ids)
                ));
            };
            $s['model_names']        = $resolveModelIds('model_ids');
            $s['fixed_model_names']  = $resolveModelIds('fixed_model_ids');
        }

        return $suggestions;
    }

    // Rejects a suggestion with a given reason, sets status to rejected_by_admin
    public function rejectSuggestion(int $id, string $reason): bool
    {
        $stmt = $this->db->prepare("UPDATE suggestions SET status = 'rejected_by_admin', rejection_reason = ? WHERE id = ?");
        return $stmt->execute([$reason, $id]);
    }

    // Permanently deletes a suggestion by its ID
    public function deleteSuggestion(int $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM suggestions WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
