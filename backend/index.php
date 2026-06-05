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

$body = json_decode(file_get_contents('php://input'), true) ?? [];

function json_response(array $data): void
{
	http_response_code($data['status'] ?? 200);
	echo json_encode($data, JSON_THROW_ON_ERROR);
	exit;
}

$authController = new AuthController();
$userController = new UserController();

$routes = [
	'POST /auth/register' => static fn() => json_response($authController->register($body)),
	'POST /auth/login'    => static fn() => json_response($authController->login($body)),
	'GET /user/profile'   => static fn() => json_response($userController->profile()),
];

if (isset($routes["$method $uri"])) {
	$routes["$method $uri"]();
}

json_response(Response::error('Route not found', 404));
