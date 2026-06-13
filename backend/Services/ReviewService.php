<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use App\Models\Review;
use App\Services\ModerationService;



final class ReviewService
{
    public function __construct(
        private readonly Review $reviewModel = new Review(),
        private readonly ModerationService $moderationService = new ModerationService(),
        private readonly User $userModel = new User()
    ) {
    }

    // Handles a user submitting a new review or comment, runs AI moderation, and returns the result
    public function submitReview(int $userId, array $payload): array
    {
        $comment = trim($payload['comment'] ?? '');
        $rating = (int) ($payload['rating'] ?? 0);
        $toolId = (int) ($payload['tool_id'] ?? 0);

        if ($toolId <= 0) {
            return ['success' => false, 'message' => 'Invalid AI tool selected.'];
        }
        if ($rating < 1 || $rating > 5) {
            return ['success' => false, 'message' => 'Rating must be between 1 and 5.'];
        }

        $status = 'approved';
        $aiFlagReason = null;

        if (!empty($comment)) {
            $moderationResult = $this->moderationService->moderate($comment);

            if ($moderationResult['flagged']) {
                $status = 'flagged';
                $aiFlagReason = json_encode([
                    'reason'           => $moderationResult['reason'],
                    'confidence_score' => $moderationResult['confidence_score'],
                ], JSON_THROW_ON_ERROR);
            }
        }

        $reviewId = $this->reviewModel->create([
            'user_id' => $userId,
            'tool_id' => $toolId,
            'rating'  => $rating,
            'comment' => $comment,
            'status'  => $status,
        ]);

        if ($status === 'flagged') {
            $this->reviewModel->updateModeration($reviewId, $status, $aiFlagReason);
        }

        return [
            'success' => true,
            'message' => $status === 'approved'
                ? 'Review published successfully!'
                : 'Your review has been submitted for moderation.',
            'data'    => $this->reviewModel->findById($reviewId)
        ];
    }

    // Updates an existing review, re-runs AI moderation if the comment changed
    public function updateReview(int $userId, int $reviewId, array $payload): array
    {
        $existing = $this->reviewModel->findById($reviewId);
        if (!$existing) {
            return ['success' => false, 'message' => 'Review not found.'];
        }
        if ((int) $existing['user_id'] !== $userId) {
            return ['success' => false, 'message' => 'You can only edit your own reviews.'];
        }

        $comment = trim($payload['comment'] ?? '');
        $rating = (int) ($payload['rating'] ?? 0);

        if ($rating < 1 || $rating > 5) {
            return ['success' => false, 'message' => 'Rating must be between 1 and 5.'];
        }

        $status = 'approved';
        $aiFlagReason = null;

        if (!empty($comment)) {
            $moderationResult = $this->moderationService->moderate($comment);

            if ($moderationResult['flagged']) {
                $status = 'flagged';
                $aiFlagReason = json_encode([
                    'reason'           => $moderationResult['reason'],
                    'confidence_score' => $moderationResult['confidence_score'],
                ], JSON_THROW_ON_ERROR);
            }
        }

        $updated = $this->reviewModel->update($reviewId, [
            'comment'        => $comment,
            'rating'         => $rating,
            'status'         => $status,
            'ai_flag_reason' => $aiFlagReason,
        ]);

        if (!$updated) {
            return ['success' => false, 'message' => 'Failed to update review.'];
        }

        return [
            'success' => true,
            'message' => $status === 'approved'
                ? 'Review updated successfully!'
                : 'Your updated review has been submitted for moderation.',
            'data'    => $this->reviewModel->findById($reviewId),
        ];
    }

    // Returns all reviews submitted by a given user
    public function listUserReviews(int $userId): array
    {
        return $this->reviewModel->allByUserId($userId) ?: [];
    }

    // Deletes a review owned by the given user
    public function deleteReview(int $userId, int $reviewId): array
    {
        $existing = $this->reviewModel->findById($reviewId);
        if (!$existing) {
            return ['success' => false, 'message' => 'Review not found.'];
        }
        if ((int) $existing['user_id'] !== $userId) {
            return ['success' => false, 'message' => 'You can only delete your own reviews.'];
        }

        $deleted = $this->reviewModel->delete($reviewId);
        if (!$deleted) {
            return ['success' => false, 'message' => 'Failed to delete review.'];
        }

        return ['success' => true, 'message' => 'Review deleted successfully.'];
    }

    // Bans a user and permanently deletes all of their reviews
    public function banUserAndCleanUp(int $userId, int $offensiveReviewId): array
    {
        if ($userId <= 0) {
            return ['success' => false, 'message' => 'Invalid User ID.'];
        }

        $userBanned = $this->userModel->updateStatus($userId, 'banned');

        if (!$userBanned) {
            return ['success' => false, 'message' => 'Failed to ban the user.'];
        }

        $this->reviewModel->deleteAllByUserId($userId);

        return [
            'success' => true,
            'message' => 'User has been banned and all their reviews have been permanently deleted.'
        ];
    }
}