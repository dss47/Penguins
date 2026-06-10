<?php

declare(strict_types=1);

final class SearchHistoryController
{
    public function __construct(private readonly SearchHistoryService $searchHistoryService = new SearchHistoryService())
    {
    }
}
