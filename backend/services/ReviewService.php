<?php

declare(strict_types=1);

final class ReviewService
{
    public function __construct(private readonly Review $reviewModel = new Review())
    {
    }

    public function submitReview(int $userId, array $payload): array
    {
        return [];
    }

    public function banUserAndCleanUp(int $userId, int $reviewId): array
    {
        return [];
    }
}