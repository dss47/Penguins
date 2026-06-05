<?php

declare(strict_types=1);

final class UserController
{
	public function __construct(
		private readonly UserService $userService = new UserService(),
		private readonly AuthMiddleware $authMiddleware = new AuthMiddleware()
	) {
	}

	public function profile(): array
	{
		$tokenPayload = $this->authMiddleware->authenticate();

		if ($tokenPayload === null) {
			return Response::error('Non authentifié', 401);
		}

		$user = (new User())->findById((int) $tokenPayload['user_id']);

		if ($user === null) {
			return Response::error('Utilisateur introuvable', 404);
		}

		return Response::success([
			'id' => (int) $user['id'],
			'name' => $user['name'],
			'email' => $user['email'],
			'role' => $user['role'],
		]);
	}

	public function deleteAccount(int $userId): array
	{
		return Response::success($this->userService->scheduleDeletion($userId));
	}
}
