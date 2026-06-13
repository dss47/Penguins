<?php

declare(strict_types=1);

final class SearchHistoryTool extends BaseModel
{
    // Links a recommended tool to a search history record
    public function linkTool(int $searchHistoryId, int $toolId): bool
    {
        $sql = 'INSERT INTO search_history_tools (search_history_id, tool_id) VALUES (?, ?)';
        $stmt = $this->db->prepare($sql);
        
        return $stmt->execute([$searchHistoryId, $toolId]);
    }
    // Returns all tools linked to a search history record, with provider and category info
    public function findToolsByHistoryId(int $historyId): array
    {
        $sql = 'SELECT t.*, p.name AS provider_name, c.name AS category_name
                FROM search_history_tools sht
                INNER JOIN ai_tools t ON sht.tool_id = t.id
                LEFT JOIN providers p ON t.provider_id = p.id
                LEFT JOIN categories c ON t.category_id = c.id
                WHERE sht.search_history_id = ?
                ORDER BY sht.id ASC';

        $stmt = $this->db->prepare($sql);
        $stmt->execute([$historyId]);

        return $stmt->fetchAll();
    }
}
