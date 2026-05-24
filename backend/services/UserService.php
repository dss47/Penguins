<?php

declare(strict_types=1);

final class UserService
{
    public function __construct(private readonly User $userModel = new User())
    {
    }

    public function scheduleDeletion(int $userId): array
    {
        return [];
    }

    public function restoreAccount(int $userId): array
    {
        return [];
    }

    public function processPermanentDeletions(): int
    {
        return 0;
    }
}