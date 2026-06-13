<?php

declare(strict_types=1);

require __DIR__ . '/../config/database.php';

try {
    $pdo = db_connection();
    
    echo "🎉 SUCCESS! Penguin is connected to the database!\n";
    
    $query = $pdo->query("SHOW TABLES");
    $tables = $query->fetchAll();
    
    echo "Found " . count($tables) . " tables in penguin_db.\n";

} catch (PDOException $e) {
    echo "❌ CONNECTION FAILED!\n";
    echo "Error Error Message: " . $e->getMessage() . "\n";
}