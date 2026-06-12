<?php

declare(strict_types=1);

final class User extends BaseModel
{
	public function findByEmail(string $email): ?array
	{
		$stmt = $this->db->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
		$stmt->execute([$email]);
		$user = $stmt->fetch();
		return $user ?: null;
	}

	public function findById(int $userId): ?array
	{
		$stmt = $this->db->prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
		$stmt->execute([$userId]);
		$user = $stmt->fetch();
		return $user ?: null;
	}

public function create(array $data): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO users (profession_id, name, email, password_hash, profile_url, role, status, created_at, updated_at)
             VALUES (:profession_id, :name, :email, :password_hash, :profile_url, :role, :status, NOW(), NOW())'
        );
        $stmt->execute([
            ':profession_id' => $data['profession_id'] ?? null,
            ':name'          => $data['name'],
            ':email'         => $data['email'],
            ':password_hash' => $data['password_hash'],
            ':profile_url'   => $data['profile_url'] ?? null,
            ':role'          => $data['role'] ?? 'user',
            ':status'        => $data['status'] ?? 'active',
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function update(int $id, array $data): bool
    {
        $sql = 'UPDATE users SET 
                    profession_id = :profession_id,
                    name = :name,
                    email = :email,
                    profile_url = :profile_url,
                    role = :role,
                    status = :status,
                    updated_at = NOW()
                WHERE id = :id';
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':profession_id' => $data['profession_id'] ?? null,
            ':name'          => $data['name'],
            ':email'         => $data['email'],
            ':profile_url'   => $data['profile_url'] ?? null,
            ':role'          => $data['role'] ?? 'user',
            ':status'        => $data['status'] ?? 'active',
            ':id'            => $id,
        ]);
    }

    public function updatePassword(int $id, string $passwordHash): bool
    {
        $stmt = $this->db->prepare('UPDATE users SET password_hash = :password_hash, updated_at = NOW() WHERE id = :id');
        return $stmt->execute([
            ':password_hash' => $passwordHash,
            ':id'            => $id,
        ]);
    }
}
