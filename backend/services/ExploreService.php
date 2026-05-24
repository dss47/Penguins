<?php

declare(strict_types=1);

final class ExploreService
{
    public function __construct(private readonly Tool $toolModel = new Tool())
    {
    }

    public function home(): array
    {
        return [];
    }

    public function searchByKeywords(string $query): array
    {
        return [];
    }

    public function searchByPrompt(string $prompt): array
    {
        return [];
    }

    public function filterTools(?int $categoryId = null, ?int $providerId = null): array
    {
        return [];
    }

    public function getToolDetails(int $toolId): array
    {
        return [];
    }
}