<?php

declare(strict_types=1);

spl_autoload_register(static function (string $class): void {
	$baseDir = __DIR__ . DIRECTORY_SEPARATOR;
	$paths = [
		$baseDir . 'controllers/' . $class . '.php',
		$baseDir . 'services/' . $class . '.php',
		$baseDir . 'models/' . $class . '.php',
		$baseDir . 'middleware/' . $class . '.php',
		$baseDir . 'utils/' . $class . '.php',
		$baseDir . 'config/' . $class . '.php',
	];

	foreach ($paths as $path) {
		if (is_file($path)) {
			require_once $path;
			return;
		}
	}
});

require_once __DIR__ . '/config/database.php';

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
	http_response_code(204);
	exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = rtrim($uri, '/');

$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
$isMultipart = strpos($contentType, 'multipart/form-data') !== false;
$body = $isMultipart ? $_POST : (json_decode(file_get_contents('php://input'), true) ?? []);

function json_response(array $data): void
{
	http_response_code($data['status'] ?? 200);
	echo json_encode($data, JSON_THROW_ON_ERROR);
	exit;
}

$authController = new AuthController();
$userController = new UserController();
$adminController = new AdminController();
$toolController = new ToolController();
$reviewController = new ReviewController();
$favoriteController = new FavoriteController();
$shelfController = new ShelfController();
$suggestionController = new SuggestionController();
$searchHistoryController = new SearchHistoryController();
$exploreController = new ExploreController();

$routes = [
	'POST /auth/register' => static fn() => json_response($authController->register($body)),
	'POST /auth/login'    => static fn() => json_response($authController->login($body)),
	'GET /user/profile'   => static fn() => json_response($userController->profile()),
	'POST /explore/recommend' => static fn() => json_response($exploreController->recommend($body)),
	'GET /admin/dashboard' => static fn() => json_response($adminController->dashboard()),
	'GET /admin/users'     => static fn() => json_response($adminController->users()),
	'POST /admin/users/promote' => static fn() => json_response($adminController->promoteUser($body)),
	'POST /admin/users/demote'  => static fn() => json_response($adminController->demoteUser($body)),
	'POST /admin/users/ban'     => static fn() => json_response($adminController->banUser($body)),
	'POST /admin/users/unban'   => static fn() => json_response($adminController->unbanUser($body)),
	'GET /admin/suggestions'    => static fn() => json_response($adminController->suggestions()),
	'POST /admin/suggestions/approve' => static fn() => json_response($adminController->approveSuggestion($body)),
	'POST /admin/suggestions/create'  => static fn() => json_response($adminController->createSuggestion($body, $_FILES['logo'] ?? null)),
	'GET /admin/suggestions/history'  => static fn() => json_response($adminController->suggestionHistory()),
	'POST /admin/suggestions/reject'  => static fn() => json_response($adminController->rejectSuggestion($body)),
	'POST /admin/suggestions/delete'  => static fn() => json_response($adminController->deleteSuggestion($body)),
	'POST /admin/suggestions/update'  => static fn() => json_response($adminController->updateSuggestion($body, $_FILES['logo'] ?? null)),
	'POST /suggestions/create' => static fn() => json_response($suggestionController->create($body, $_FILES['logo'] ?? null)),
	'GET /suggestions/history' => static fn() => json_response($suggestionController->history()),
	'GET /admin/data/lists'                         => static fn() => json_response($adminController->formData()),
	'GET /admin/moderation/reviews'               => static fn() => json_response($adminController->moderationReviews()),
	'POST /admin/moderation/reviews/approve'       => static fn() => json_response($adminController->approveModerationReview($body)),
	'POST /admin/moderation/reviews/delete'        => static fn() => json_response($adminController->deleteModerationReview($body)),
	'GET /admin/tools'                             => static fn() => json_response($adminController->tools()),
	'POST /admin/tools/update-status'              => static fn() => json_response($adminController->updateToolStatus($body)),
	'POST /admin/tools/delete'                     => static fn() => json_response($adminController->deleteTool($body)),
	'GET /favorites'         => static fn() => json_response($favoriteController->index()),
	'POST /favorites/toggle' => static fn() => json_response($favoriteController->toggle($body)),
	'GET /shelves'           => static fn() => json_response($shelfController->list()),
	'GET /shelves/items'     => static fn() => json_response($shelfController->show($_GET)),
	'POST /shelves/create'   => static fn() => json_response($shelfController->create($body)),
	'POST /shelves/update'   => static fn() => json_response($shelfController->update($body)),
	'POST /shelves/delete'   => static fn() => json_response($shelfController->delete($body)),
	'POST /shelves/toggle'   => static fn() => json_response($shelfController->toggleItem($body)),
	'GET /tools'          => static fn() => json_response($toolController->index()),
	'GET /tools/reviews'  => static fn() => json_response($toolController->reviews()),
	'POST /reviews/submit' => static fn() => json_response($reviewController->submit($body)),
	'POST /reviews/update' => static fn() => json_response($reviewController->update($body)),
	'POST /reviews/delete' => static fn() => json_response($reviewController->delete($body)),
	'GET /user/reviews'  => static fn() => json_response($reviewController->list()),
	'GET /user/search-history' => static fn() => json_response($searchHistoryController->list()),
	'GET /user/stats' => static fn() => json_response($userController->stats()),
	'POST /user/profile/update' => static fn() => json_response($userController->updateProfile($body, $_FILES['avatar'] ?? null)),
	'GET /professions' => static fn() => json_response($userController->professions()),
];

if (isset($routes["$method $uri"])) {
	$routes["$method $uri"]();
}

json_response(Response::error('Route not found', 404));
