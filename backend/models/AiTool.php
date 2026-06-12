<?php

declare(strict_types=1);

final class AiTool extends BaseModel
{
    public function all(): array
    {
        $sql = 'SELECT * FROM ai_tools ORDER BY created_at DESC';
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll() ?: [];
    }

    public function recommendationCandidates(): array
    {
        $sql = "SELECT id, name FROM ai_tools WHERE status = 'active' ORDER BY name ASC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll() ?: [];
    }

    public function findActiveByIds(array $ids): array
    {
        $ids = array_values(array_unique(array_filter(array_map('intval', $ids), fn($id) => $id > 0)));
        if (empty($ids)) {
            return [];
        }

        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $sql = "SELECT t.id,
                       t.name,
                       t.description,
                       t.logo_url,
                       t.website_url,
                       t.global_rating,
                       t.website_rating,
                       c.name AS category_name,
                       p.name AS provider_name
                FROM ai_tools t
                LEFT JOIN categories c ON t.category_id = c.id
                LEFT JOIN providers p ON t.provider_id = p.id
                WHERE t.status = 'active' AND t.id IN ($placeholders)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute($ids);
        $tools = $stmt->fetchAll() ?: [];

        $byId = [];
        foreach ($tools as $tool) {
            $byId[(int) $tool['id']] = $tool;
        }

        $ordered = [];
        foreach ($ids as $id) {
            if (isset($byId[$id])) {
                $ordered[] = $byId[$id];
            }
        }

        return $ordered;
    }

    public function findById(int $toolId): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM ai_tools WHERE id = ? limit 1');
        $stmt->execute([$toolId]);
        $tool = $stmt->fetch();
        return $tool ?: null;
    }
    public function findByName(string $name): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM ai_tools WHERE name = ? limit 1');
        $stmt->execute([$name]);
        $tool = $stmt->fetch();
        return $tool ?: null;
    }

    public function create(array $data): ?int 
    {
        $sql = 'INSERT INTO ai_tools (
                    category_id, 
                    provider_id, 
                    created_by, 
                    validated_by, 
                    name, 
                    description, 
                    logo_url, 
                    website_url, 
                    global_rating,
                    website_rating,
                    release_date, 
                    status
                ) VALUES (
                    :category_id, 
                    :provider_id, 
                    :created_by, 
                    :validated_by, 
                    :name, 
                    :description, 
                    :logo_url, 
                    :website_url, 
                    :global_rating, 
                    :website_rating,
                    :release_date, 
                    :status
                )';
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
                    ':category_id'   => $data['category_id'],
                    ':provider_id'   => $data['provider_id'],
                    ':created_by'    => $data['created_by'] ?? null,
                    ':validated_by'  => $data['validated_by'] ?? null,
                    ':name'          => $data['name'],
                    ':description'   => $data['description'] ?? null,
                    ':logo_url'      => $data['logo_url'] ?? null,
                    ':website_url'   => $data['website_url'],
                    ':global_rating' => $data['global_rating'] ?? null,
                    ':website_rating' => $data['website_rating'] ?? null,
                    ':release_date'  => $data['release_date'] ?? null,
                    ':status'        => $data['status'] ?? 'pending',
        ]);
    return (int) $this->db->lastInsertId();
    }
    public function updateStatus(int $toolId, string $newStatus): bool
    {
        $sql = 'UPDATE ai_tools SET status = :status WHERE id = :id';
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':status' => $newStatus,
            ':id'     => $toolId
        ]);
    }
    public function update(int $toolId, array $data): bool
    {
        $sql = 'UPDATE ai_tools SET 
                    category_id = :category_id,
                    provider_id = :provider_id,
                    name = :name,
                    description = :description,
                    logo_url = :logo_url,
                    website_url = :website_url,
                    global_rating = :global_rating,
                    website_rating = :website_rating,
                    release_date = :release_date
                WHERE id = :id';

        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':category_id'    => $data['category_id'],
            ':provider_id'    => $data['provider_id'],
            ':name'           => $data['name'],
            ':description'    => $data['description'] ?? null,
            ':logo_url'       => $data['logo_url'] ?? null,
            ':website_url'    => $data['website_url'],
            ':global_rating'  => $data['global_rating'] ?? null,
            ':website_rating' => $data['website_rating'] ?? null,
            ':release_date'   => $data['release_date'] ?? null,
            ':id'             => $toolId,
        ]);
    }

    public function delete(int $toolId): bool
    {
        $stmt = $this->db->prepare('DELETE FROM ai_tools WHERE id = ?');
        return $stmt->execute([$toolId]);
    }
    
}
