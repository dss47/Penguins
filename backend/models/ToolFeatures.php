<?php

declare(strict_types=1);

final class ToolFeature extends BaseModel
{
    public function linkFeatureToTool(int $toolId, int $featureId): bool
    {
        $sql = 'INSERT INTO tool_features (tool_id, feature_id) VALUES (?, ?)';
        $stmt = $this->db->prepare($sql);
        
        return $stmt->execute([$toolId, $featureId]);
    }

    public function unlinkFeatureFromTool(int $toolId, int $featureId): bool
    {
        $sql = 'DELETE FROM tool_features WHERE tool_id = ? AND feature_id = ?';
        $stmt = $this->db->prepare($sql);
        
        return $stmt->execute([$toolId, $featureId]);
    }
    
    public function findFeaturesByToolId(int $toolId): array
    {
        $sql = 'SELECT f.* FROM tool_features tf
                INNER JOIN features f ON tf.feature_id = f.id
                WHERE tf.tool_id = ?
                ORDER BY f.name ASC';

        $stmt = $this->db->prepare($sql);
        $stmt->execute([$toolId]);

        return $stmt->fetchAll();
    }
}