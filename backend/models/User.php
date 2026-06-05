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
			'INSERT INTO users (name, email, password_hash, role, status, created_at, updated_at)
			 VALUES (:name, :email, :password_hash, :role, :status, NOW(), NOW())'
		);
		$stmt->execute([
			':name' => $data['name'],
			':email' => $data['email'],
			':password_hash' => $data['password_hash'],
			':role' => $data['role'] ?? 'user',
			':status' => $data['status'] ?? 'active',
		]);
		return (int) $this->db->lastInsertId();
	}
}
