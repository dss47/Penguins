<?php

declare(strict_types=1);

final class ToolService
{
    public function __construct(private readonly Tool $toolModel = new Tool())
    {
    }

    public function listTools(): array
    {
        return [];
    }

    public function validateToolData(array $payload): array
    {
        return [];
    }
}