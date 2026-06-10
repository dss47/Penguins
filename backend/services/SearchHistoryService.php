<?php

declare(strict_types=1);

final class SearchHistoryService
{
    public function __construct(
        private readonly SearchHistory $searchHistoryModel = new SearchHistory(),
        private readonly SearchHistoryTool $searchHistoryToolModel = new SearchHistoryTool()
    ) {
    }
}
