<?php

declare(strict_types=1);

// 1. Include your database setup file
require __DIR__ . '/../config/database.php';

try {
    // 2. Attempt to trigger the connection function
    $pdo = db_connection();
    
    echo "🎉 SUCCESS! Penguin is connected to the database!\n";
    
    // Bonus: Let's run a quick query to count our tables
    $query = $pdo->query("SHOW TABLES");
    $tables = $query->fetchAll();
    
    echo "Found " . count($tables) . " tables in penguin_db.\n";

} catch (PDOException $e) {
    // 3. Catch any errors (like wrong password or DB down)
    echo "❌ CONNECTION FAILED!\n";
    echo "Error Error Message: " . $e->getMessage() . "\n";
}