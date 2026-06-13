<?php

declare(strict_types=1);

namespace App\Models;

use PDO;



abstract class BaseModel
{
    protected PDO $db;

    // Initializes the model with a PDO connection, using the global connection by default
    public function __construct(?PDO $db = null)
    {
        $this->db = $db ?? db_connection();
    }
}