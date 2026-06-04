<?php

declare(strict_types=1);
require __DIR__ . '/../config/database.php';

try {
    $pdo = db_connection();
    $adminName = 'Super Admin';
    $adminEmail = 'admin@penguin.com';
    $plainPassword = 'SecurePassword123!';
    $passwordHash = password_hash($plainPassword, PASSWORD_DEFAULT);
    
    $role = 'admin';
    $status = 'active';
    $sql = "INSERT INTO users (name, email, password_hash, role, status) 
            VALUES (:name, :email, :password_hash, :role, :status)";
            
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':name' => $adminName,
        ':email' => $adminEmail,
        ':password_hash' => $passwordHash,
        ':role' => $role,
        ':status' => $status
    ]);

    echo "🎉 SUCCESS! Admin user successfully created.\n";
    echo "📧 Email: {$adminEmail}\n";
    echo "🔑 Plain Password (for login testing): {$plainPassword}\n";
    echo "🔒 Stored Hash: {$passwordHash}\n";

} catch (PDOException $e) {
    echo "❌ INSERT FAILED!\n";
    if ($e->getCode() === '23000') {
        echo "Error: A user with the email '{$adminEmail}' already exists.\n";
    } else {
        echo "Error Message: " . $e->getMessage() . "\n";
    }
}