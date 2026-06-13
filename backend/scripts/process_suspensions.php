<?php

declare(strict_types=1);

// CRON script: restores users whose timed suspension has expired
// Usage: php backend/scripts/process_suspensions.php

require_once __DIR__ . '/../../vendor/autoload.php';

use App\Services\AdminService;

$adminService = new AdminService();
$db = db_connection();

$stmt = $db->prepare("SELECT id FROM users WHERE status = 'suspended' AND suspended_until IS NOT NULL AND suspended_until <= NOW()");
$stmt->execute();
$expired = $stmt->fetchAll();

$count = 0;
foreach ($expired as $user) {
    $adminService->updateUserStatus((int) $user['id'], 'active');
    $count++;
}

echo "[" . date('Y-m-d H:i:s') . "] Expired suspensions restored: $count" . PHP_EOL;
