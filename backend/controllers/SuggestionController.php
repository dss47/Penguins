<?php

declare(strict_types=1);

final class SuggestionController
{
    public function __construct(private readonly SuggestionService $suggestionService = new SuggestionService())
    {
    }
}
