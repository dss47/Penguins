<?php

declare(strict_types=1);

final class ToolModel extends BaseModel
{
    public function linkModelToTool(int $toolId, int $modelId): bool
    {
        $sql = 'INSERT INTO tool_models (tool_id, model_id) VALUES (?, ?)';
        $stmt = $this->db->prepare($sql);
        
        return $stmt->execute([$toolId, $modelId]);
    }

    public function unlinkModelFromTool(int $toolId, int $modelId): bool
    {
        $sql = 'DELETE FROM tool_models WHERE tool_id = ? AND model_id = ?';
        $stmt = $this->db->prepare($sql);
        
        return $stmt->execute([$toolId, $modelId]);
    }
    
    public function findModelsByToolId(int $toolId): array
    {
        $sql = 'SELECT m.* FROM tool_models tm
                INNER JOIN models m ON tm.model_id = m.id
                WHERE tm.tool_id = ? AND m.status = \'active\'';

        $stmt = $this->db->prepare($sql);
        $stmt->execute([$toolId]);

        return $stmt->fetchAll();
    }
}