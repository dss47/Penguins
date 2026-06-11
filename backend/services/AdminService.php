<?php

declare(strict_types=1);

final class AdminService
{
    private PDO $db;

    public function __construct()
    {
        $this->db = db_connection();
    }

    public function getDashboardData(): array
    {
        $stats = [
            'users' => (int) $this->db->query("SELECT COUNT(*) FROM users")->fetchColumn(),
            'active_ai_tools' => (int) $this->db->query("SELECT COUNT(*) FROM ai_tools WHERE status = 'active'")->fetchColumn(),
            'pending_manager_suggestions' => (int) $this->db->query("SELECT COUNT(*) FROM suggestions WHERE status = 'pending_manager'")->fetchColumn(),
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
}
