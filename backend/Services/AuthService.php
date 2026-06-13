<?php

declare(strict_types=1);

namespace App\Services;

use Exception;
use App\Models\User;
use App\Utils\JwtService;
use App\Utils\Response;



final class AuthService
{
	public function __construct(
		private readonly User $userModel = new User(),
		private readonly JwtService $jwtService = new JwtService()
	) {
	}

	// Validates input and creates a new user account, returns the created user data
	public function registerUser(string $firstName, string $lastName, string $email, string $password): array
	{
		if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
			return Response::error('Email invalide', 400);
		}

		if (strlen($password) < 8) {
			return Response::error('Le mot de passe doit contenir au moins 8 caractères', 400);
		}

		$firstName = trim(htmlspecialchars($firstName, ENT_QUOTES, 'UTF-8'));
		$lastName = trim(htmlspecialchars($lastName, ENT_QUOTES, 'UTF-8'));

		if ($firstName === '' || $lastName === '') {
			return Response::error('Le prénom et le nom sont requis', 400);
		}

		$name = mb_substr(trim("$firstName $lastName"), 0, 100);

		if ($this->userModel->findByEmail($email) !== null) {
			return Response::error('Cet email est déjà utilisé', 409);
		}

		$userId = $this->userModel->create([
			'name' => $name,
			'email' => $email,
			'password_hash' => password_hash($password, PASSWORD_BCRYPT),
			'role' => 'user',
			'status' => 'active',
		]);

		return Response::created([
			'id' => $userId,
			'name' => $name,
			'email' => $email,
			'role' => 'user',
			'profile_url' => null,
		]);
	}

	// Verifies email and password, returns a JWT token and user data on success
	public function verifyCredentials(string $email, string $password): array|false
	{
		$user = $this->userModel->findByEmail($email);

		if ($user === null || !password_verify($password, $user['password_hash'])) {
			return false;
		}

		if ($user['status'] === 'deleted') {
            if ($user['scheduled_deletion'] !== null && strtotime($user['scheduled_deletion']) > time()) {
                $this->userModel->restoreAccount((int) $user['id']);
            } else {
                throw new Exception('Ce compte a été définitivement supprimé.');
            }
        } elseif ($user['status'] === 'suspended') {
            if ($user['suspended_until'] !== null && strtotime($user['suspended_until']) <= time()) {
                $this->userModel->restoreAccount((int) $user['id']);
            } elseif ($user['suspended_until'] !== null) {
                $date = date('d/m/Y H:i', strtotime($user['suspended_until']));
                throw new Exception("Compte suspendu jusqu'au $date.");
            } else {
                throw new Exception('Ce compte a été suspendu par un administrateur.');
            }
        } elseif ($user['status'] !== 'active') {
            throw new Exception('Ce compte n\'est plus actif.');
        }

		$token = $this->jwtService->generateToken([
			'user_id' => (int) $user['id'],
			'role' => $user['role'],
		]);

		return [
			'token' => $token,
			'user' => [
				'id' => (int) $user['id'],
				'name' => $user['name'],
				'email' => $user['email'],
				'role' => $user['role'],
				'profile_url' => $user['profile_url'] ?? null,
			],
		];
	}

	// Returns a logout success response
	public function logout(): array
	{
		return Response::success(['message' => 'Déconnexion réussie']);
	}
}
