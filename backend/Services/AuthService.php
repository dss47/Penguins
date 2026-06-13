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

		if (($user['status'] ?? 'active') !== 'active') {
            $statusMsg = $user['status'] === 'suspended' ? 'Ce compte a été suspendu par un administrateur.' : 'Ce compte n\'est plus actif.';
            throw new Exception($statusMsg);
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
