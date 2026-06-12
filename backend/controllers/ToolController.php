<?php

declare(strict_types=1);

final class ToolController
{
    public function __construct(private readonly ToolService $toolService = new ToolService())
    {
    }

    public function index(): array
    {
        $name = $_GET['name'] ?? null;
        if ($name) {
            return $this->toolService->getPublicToolByName($name);
        }
        return Response::success($this->toolService->listPublicTools());
    }
}