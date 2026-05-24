<?php

declare(strict_types=1);

final class AuthController
{
    public function __construct(private readonly AuthService $authService = new AuthService())
    {
    }

    public function register(array $payload): array
    {
        return Response::created($this->authService->registerUser(
            $payload['name'] ?? '',
            $payload['email'] ?? '',
            $payload['password'] ?? ''
        ));
    }

    public function login(array $payload): array
    {
        $result = $this->authService->verifyCredentials(
            $payload['email'] ?? '',
            $payload['password'] ?? ''
        );

        if ($result === false) {
            return Response::error('Invalid credentials', 401);
        }

        return Response::success($result);
    }
}