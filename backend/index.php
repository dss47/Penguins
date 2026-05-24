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

$routes = [
	'auth' => AuthController::class,
	'explore' => ExploreController::class,
	'tools' => ToolController::class,
	'favorites' => FavoriteController::class,
	'shelves' => ShelfController::class,
	'reviews' => ReviewController::class,
	'user' => UserController::class,
	'admin' => AdminController::class,
];

return $routes;
