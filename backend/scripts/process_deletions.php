<?php

declare(strict_types=1);

// CRON script: permanently deletes user accounts whose 30-day grace period has expired
// Usage: php backend/scripts/process_deletions.php

require_once __DIR__ . '/../../vendor/autoload.php';

use App\Services\UserService;

$userService = new UserService();
$count = $userService->processPermanentDeletions();

echo "[" . date('Y-m-d H:i:s') . "] Permanent deletions processed: $count" . PHP_EOL;
