<?php

declare(strict_types=1);

$envFile = dirname(__DIR__) . '/.env';
if (is_file($envFile)) {
    foreach (file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) continue;
        [$key, $value] = explode('=', $line, 2);
        putenv(trim($key) . '=' . trim($value));
    }
}

return [
    'app_name' => getenv('APP_NAME') ?: 'Penguins',
    'app_env' => getenv('APP_ENV') ?: 'local',
    'app_debug' => filter_var(getenv('APP_DEBUG') ?: 'true', FILTER_VALIDATE_BOOL),
    'jwt_secret' => getenv('JWT_SECRET') ?: '',
    'db_host' => getenv('DB_HOST') ?: '127.0.0.1',
    'db_port' => getenv('DB_PORT') ?: '3306',
    'db_name' => getenv('DB_NAME') ?: 'penguin_db', 
    'db_user' => getenv('DB_USER') ?: 'penguin',
    'db_pass' => getenv('DB_PASS') ?: 'penguin123',
    'ai_base_url' => getenv('AI_PROVIDER_BASE_URL') ?: 'https://agentrouter.org/v1/chat/completions',
    'ai_api_key'  => getenv('AI_PROVIDER_API_KEY') ?: 'sk-GN7Z...',
];