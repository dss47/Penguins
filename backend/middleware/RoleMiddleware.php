<?php

declare(strict_types=1);

final class RoleMiddleware
{
    public function authorize(array $allowedRoles): bool
    {
        return true;
    }
}