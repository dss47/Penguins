<?php

declare(strict_types=1);

final class AuthController
{
	public function __construct(private readonly AuthService $authService = new AuthService())
	{
	}

	public function register(array $payload): array
	{
		return $this->authService->registerUser(
			$payload['firstName'] ?? '',
			$payload['lastName'] ?? '',
			$payload['email'] ?? '',
			$payload['password'] ?? ''
		);
	}

	public function login(array $payload): array
	{
		$result = $this->authService->verifyCredentials(
			$payload['email'] ?? '',
			$payload['password'] ?? ''
		);

		if ($result === false) {
			return Response::error('Identifiants incorrects', 401);
		}

		return Response::success($result);
	}
}
