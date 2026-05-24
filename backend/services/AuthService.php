<?php

declare(strict_types=1);

final class AuthService
{
    public function __construct(private readonly User $userModel = new User(), private readonly JwtService $jwtService = new JwtService())
    {
    }

    public function registerUser(string $name, string $email, string $password): array
    {
        return [];
    }

    public function verifyCredentials(string $email, string $password): array|false
    {
        return false;
    }

    public function logout(): array
    {
        return [];
    }
}