<?php

declare(strict_types=1);

namespace App\Models;



final class User extends BaseModel
{
	// Finds a user by their email address
	public function findByEmail(string $email): ?array
	{
		$stmt = $this->db->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
		$stmt->execute([$email]);
		$user = $stmt->fetch();
		return $user ?: null;
	}

	// Finds a user by their ID
	public function findById(int $userId): ?array
	{
		$stmt = $this->db->prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
		$stmt->execute([$userId]);
		$user = $stmt->fetch();
		return $user ?: null;
	}

// Creates a new user record and returns the new user's ID
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

    // Updates only the columns present in $data
    public function update(int $id, array $data): bool
    {
        $allowed = ['profession_id', 'name', 'email', 'profile_url', 'role', 'status'];
        $sets = [];
        $params = [':id' => $id];
        foreach ($allowed as $col) {
            if (array_key_exists($col, $data)) {
                $sets[] = "$col = :$col";
                $params[":$col"] = $data[$col];
            }
        }
        if (empty($sets)) return false;
        $sets[] = 'updated_at = NOW()';
        $sql = 'UPDATE users SET ' . implode(', ', $sets) . ' WHERE id = :id';
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }

    // Updates only the status field for a user (active, suspended, banned)
    public function updateStatus(int $id, string $status): bool
    {
        $stmt = $this->db->prepare('UPDATE users SET status = :status, updated_at = NOW() WHERE id = :id');
        return $stmt->execute([':status' => $status, ':id' => $id]);
    }

    // Updates only the password hash for a user
    public function updatePassword(int $id, string $passwordHash): bool
    {
        $stmt = $this->db->prepare('UPDATE users SET password_hash = :password_hash, updated_at = NOW() WHERE id = :id');
        return $stmt->execute([
            ':password_hash' => $passwordHash,
            ':id'            => $id,
        ]);
    }

    // Sets a user's status to deleted and records the scheduled permanent deletion date
    public function scheduleDeletion(int $userId, string $scheduledDate): bool
    {
        $stmt = $this->db->prepare('UPDATE users SET status = :status, scheduled_deletion = :scheduled_deletion, updated_at = NOW() WHERE id = :id');
        return $stmt->execute([
            ':status'             => 'deleted',
            ':scheduled_deletion' => $scheduledDate,
            ':id'                 => $userId,
        ]);
    }

    // Restores a deleted user account back to active during the grace period
    public function restoreAccount(int $userId): bool
    {
        $stmt = $this->db->prepare('UPDATE users SET status = :status, scheduled_deletion = NULL, updated_at = NOW() WHERE id = :id');
        return $stmt->execute([
            ':status' => 'active',
            ':id'     => $userId,
        ]);
    }

    // Returns all users whose grace period has expired, ready for hard deletion
    public function getUsersReadyForPermanentDeletion(): array
    {
        $stmt = $this->db->prepare("SELECT id FROM users WHERE status = 'deleted' AND scheduled_deletion IS NOT NULL AND scheduled_deletion <= NOW()");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    // Permanently removes a user record from the database
    public function deletePermanently(int $userId): bool
    {
        $stmt = $this->db->prepare('DELETE FROM users WHERE id = ?');
        return $stmt->execute([$userId]);
    }
}
