<?php

declare(strict_types=1);

final class AdminController
{
    public function __construct(private readonly AdminService $adminService = new AdminService())
    {
    }

    public function dashboard(): array
    {
        return Response::success($this->adminService->getDashboardData());
    }
}