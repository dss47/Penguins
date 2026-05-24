<?php

declare(strict_types=1);

final class ToolController
{
    public function __construct(private readonly ToolService $toolService = new ToolService())
    {
    }

    public function index(): array
    {
        return Response::success($this->toolService->listTools());
    }
}