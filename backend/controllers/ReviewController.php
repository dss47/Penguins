<?php

declare(strict_types=1);

final class ReviewController
{
    public function __construct(private readonly ReviewService $reviewService = new ReviewService())
    {
    }

    public function submit(array $payload, int $userId): array
    {
        return Response::created($this->reviewService->submitReview($userId, $payload));
    }
}