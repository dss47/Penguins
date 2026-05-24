<?php

declare(strict_types=1);

final class ExploreController
{
    public function __construct(private readonly ExploreService $exploreService = new ExploreService())
    {
    }

    public function home(): array
    {
        return Response::success($this->exploreService->home());
    }

    public function search(array $query): array
    {
        return Response::success($this->exploreService->searchByKeywords((string) ($query['q'] ?? '')));
    }
}