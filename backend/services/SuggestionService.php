<?php

declare(strict_types=1);

final class SuggestionService
{
    public function __construct(private readonly Suggestion $suggestionModel = new Suggestion())
    {
    }

    public function createSuggestion(array $payload): array
    {
        return [];
    }

    public function listPendingSuggestions(): array
    {
        return [];
    }
}