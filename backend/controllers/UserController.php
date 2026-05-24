<?php

declare(strict_types=1);

final class UserController
{
    public function __construct(private readonly UserService $userService = new UserService())
    {
    }

    public function deleteAccount(int $userId): array
    {
        return Response::success($this->userService->scheduleDeletion($userId));
    }
}