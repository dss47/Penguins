<?php

declare(strict_types=1);

namespace App\Middleware;



final class RoleMiddleware
{
    // Authorizes the user against a list of allowed roles (currently always returns true)
    public function authorize(array $allowedRoles): bool
    {
        return true;
    }
}