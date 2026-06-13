<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Services\UserService;
use App\Services\FavoriteService;
use App\Services\ShelfService;
use App\Models\Review;
use App\Models\Suggestion;
use App\Models\User;
use App\Models\Profession;
use App\Models\SearchHistory;
use App\Middleware\AuthMiddleware;
use App\Utils\Response;



final class UserController
{
	public function __construct(
		private readonly UserService $userService = new UserService(),
		private readonly AuthMiddleware $authMiddleware = new AuthMiddleware(),
		private readonly FavoriteService $favoriteService = new FavoriteService(),
		private readonly ShelfService $shelfService = new ShelfService(),
		private readonly Review $reviewModel = new Review(),
		private readonly SearchHistory $searchHistoryModel = new SearchHistory()
	) {
	}

	// Authenticates the user via JWT and returns the user ID
	private function authenticate(): int
	{
		$tokenPayload = $this->authMiddleware->authenticate();
		if ($tokenPayload === null || !($tokenPayload['user_id'] ?? 0)) {
			return 0;
		}
		return (int) $tokenPayload['user_id'];
	}

	// Returns the authenticated user's profile data
	public function profile(): array
	{
		$userId = $this->authenticate();
		if (!$userId) {
			return Response::error('Non authentifié', 401);
		}

		$user = (new User())->findById($userId);
		if ($user === null) {
			return Response::error('Utilisateur introuvable', 404);
		}

		$professionName = null;
		if (!empty($user['profession_id'])) {
			$prof = (new Profession())->findById((int) $user['profession_id']);
			$professionName = $prof['name'] ?? null;
		}

		return Response::success([
			'id'              => (int) $user['id'],
			'name'            => $user['name'],
			'email'           => $user['email'],
			'role'            => $user['role'],
			'profile_url'     => $user['profile_url'] ?? null,
			'status'          => $user['status'] ?? 'active',
			'profession_id'   => $user['profession_id'] ?? null,
			'profession_name' => $professionName,
			'created_at'      => $user['created_at'] ?? null,
			'updated_at'      => $user['updated_at'] ?? null,
		]);
	}

	// Returns aggregate stats for the authenticated user (favorites, shelves, reviews, etc.)
	public function stats(): array
	{
		$userId = $this->authenticate();
		if (!$userId) {
			return Response::error('Non authentifié', 401);
		}

		$favorites = count($this->favoriteService->listUserFavorites($userId));
		$shelves = count($this->shelfService->listUserShelves($userId));
		$reviews = count($this->reviewModel->allByUserId($userId));
		$searches = count($this->searchHistoryModel->allByUserId($userId));

		$suggestionModel = new Suggestion();
		$suggestions = count($suggestionModel->allByUserId($userId));

		return Response::success([
			'favorites'  => $favorites,
			'shelves'    => $shelves,
			'reviews'    => $reviews,
			'searches'   => $searches,
			'suggestions' => $suggestions,
		]);
	}

	// Updates the authenticated user's profile (name, email, password, photo)
	public function updateProfile(array $body, ?array $file = null): array
	{
		$userId = $this->authenticate();
		if (!$userId) {
			return Response::error('Non authentifié', 401);
		}

		$data = [];
		if (isset($body['name'])) $data['name'] = trim($body['name']);
		if (isset($body['email'])) $data['email'] = trim($body['email']);
		if (array_key_exists('profession_id', $body)) $data['profession_id'] = $body['profession_id'] !== null ? (int) $body['profession_id'] : null;
		if (isset($body['current_password'])) $data['current_password'] = $body['current_password'];
		if (isset($body['new_password'])) $data['new_password'] = $body['new_password'];
		if (isset($body['new_password_confirmation'])) $data['new_password_confirmation'] = $body['new_password_confirmation'];

		$result = $this->userService->updateProfile($userId, $data, $file);

		if ($result['success']) {
			return Response::success([
				'message'     => $result['message'],
				'profile_url' => $result['profile_url'] ?? null,
			]);
		}

		return Response::error($result['message'] ?? 'Erreur lors de la mise à jour');
	}

	// Returns all available professions
	public function professions(): array
	{
		return Response::success((new Profession())->all());
	}

	// Schedules the authenticated user's account for deletion
	public function deleteAccount(int $userId): array
	{
		return Response::success($this->userService->scheduleDeletion($userId));
	}
}
