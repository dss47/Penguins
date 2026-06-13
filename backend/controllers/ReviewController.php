<?php

declare(strict_types=1);

final class ReviewController
{
    public function __construct(
        private readonly ReviewService $reviewService = new ReviewService(),
        private readonly AuthMiddleware $authMiddleware = new AuthMiddleware()
    ) {
    }

    // Authenticates the user via JWT and returns the user ID
    private function authenticate(): int
    {
        $user = $this->authMiddleware->authenticate();
        if (!$user || !($user['user_id'] ?? 0)) {
            return 0;
        }
        return (int) $user['user_id'];
    }

    // Submits a new review with AI moderation
    public function submit(array $payload): array
    {
        $userId = $this->authenticate();
        if (!$userId) {
            return Response::error('Non authentifié', 401);
        }

        $result = $this->reviewService->submitReview($userId, $payload);

        if ($result['success']) {
            return Response::success([
                'message' => $result['message'],
                'data'    => $result['data'] ?? null,
            ]);
        }

        return Response::error($result['message'] ?? 'Erreur lors de la soumission');
    }

    // Updates an existing review
    public function update(array $payload): array
    {
        $userId = $this->authenticate();
        if (!$userId) {
            return Response::error('Non authentifié', 401);
        }

        $reviewId = (int) ($payload['id'] ?? 0);
        if ($reviewId <= 0) {
            return Response::error('ID d\'avis invalide');
        }

        $result = $this->reviewService->updateReview($userId, $reviewId, $payload);

        if ($result['success']) {
            return Response::success([
                'message' => $result['message'],
                'data'    => $result['data'] ?? null,
            ]);
        }

        return Response::error($result['message'] ?? 'Erreur lors de la modification');
    }

    // Lists all reviews for the authenticated user
    public function list(): array
    {
        $userId = $this->authenticate();
        if (!$userId) {
            return Response::error('Non authentifié', 401);
        }

        $reviews = $this->reviewService->listUserReviews($userId);
        return Response::success($reviews);
    }

    // Deletes a review by its ID
    public function delete(array $payload): array
    {
        $userId = $this->authenticate();
        if (!$userId) {
            return Response::error('Non authentifié', 401);
        }

        $reviewId = (int) ($payload['id'] ?? 0);
        if ($reviewId <= 0) {
            return Response::error('ID d\'avis invalide');
        }

        $result = $this->reviewService->deleteReview($userId, $reviewId);

        if ($result['success']) {
            return Response::success(['message' => $result['message']]);
        }

        return Response::error($result['message'] ?? 'Erreur lors de la suppression');
    }
}
