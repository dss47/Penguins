<?php

declare(strict_types=1);

return [
    'app_name' => getenv('APP_NAME') ?: 'Penguins',
    'app_env' => getenv('APP_ENV') ?: 'local',
    'app_debug' => filter_var(getenv('APP_DEBUG') ?: 'true', FILTER_VALIDATE_BOOL),
    'jwt_secret' => getenv('JWT_SECRET') ?: '',
    'db_host' => getenv('DB_HOST') ?: '127.0.0.1',
    'db_port' => getenv('DB_PORT') ?: '3306',
    'db_name' => getenv('DB_NAME') ?: 'penguin_db', 
    'db_user' => getenv('DB_USER') ?: 'penguin',
    'db_pass' => getenv('DB_PASS') ?: 'penguin123'
];