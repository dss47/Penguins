<?php

declare(strict_types=1);

final class Tool extends BaseModel
{
    public function all(): array
    {
        $sql = 'SELECT * FROM ai_tools ORDER BY created_at DESC';
        $stmt = this->db->prepare($sql);
        $stmt->execute();

        return $stmt->fetchAll() ?: null ;
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
                    ':created_by'    => $data['created_by'],
                    ':validated_by'  => $data['validated_by'],
                    ':name'          => $data['name'],
                    ':description'   => $data['description'],
                    ':logo_url'      => $data['logo_url'],
                    ':website_url'   => $data['website_url'],
                    ':global_rating' => $data['global_rating'],
                    ':website_rating' => $data['website_rating'],
                    ':release_date'  => $data['release_date'],
                    ':status'        => $data['status'],
        ]);
    return (int) $this->db->lastInsertId();
    }
}