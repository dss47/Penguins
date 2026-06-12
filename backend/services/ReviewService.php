<?php

declare(strict_types=1);

final class ReviewService
{
    // We inject both the Review database model AND our Moderation Service!
    public function __construct(
        private readonly Review $reviewModel = new Review(),
        private readonly ModerationService $moderationService = new ModerationService(),
        private readonly User $userModel = new User() // Needed for the ban feature
    ) {
    }

    /**
     * Handles a user submitting a new review or comment.
     */
    public function submitReview(int $userId, array $payload): array
    {
        $comment = trim($payload['comment'] ?? '');
        $rating = (int) ($payload['rating'] ?? 0);
        $toolId = (int) ($payload['tool_id'] ?? 0);

        // 1. Basic Validation
        if ($toolId <= 0) {
            return ['success' => false, 'message' => 'Invalid AI tool selected.'];
        }
        if ($rating < 1 || $rating > 5) {
            return ['success' => false, 'message' => 'Rating must be between 1 and 5.'];
        }

        // 2. 🚨 THE AI / MODERATION CHECK 🚨
        $status = 'approved';
        $aiFlagReason = null;

        if (!empty($comment)) {
            $moderationResult = $this->moderationService->moderate($comment);

            if ($moderationResult['flagged']) {
                // The AI or the bad-word list caught something!
                // We still save the review but flag it for admin review.
                $status = 'flagged';
                $aiFlagReason = json_encode([
                    'reason'           => $moderationResult['reason'],
                    'confidence_score' => $moderationResult['confidence_score'],
                ], JSON_THROW_ON_ERROR);
            }
        }

        // 3. Save the review (approved or flagged)
        $reviewId = $this->reviewModel->create([
            'user_id' => $userId,
            'tool_id' => $toolId,
            'rating'  => $rating,
            'comment' => $comment,
            'status'  => $status,
        ]);

        // If flagged, store the AI reason
        if ($status === 'flagged') {
            $this->reviewModel->updateModeration($reviewId, $status, $aiFlagReason);
        }

        return [
            'success' => true,
            'message' => $status === 'approved'
                ? 'Review published successfully!'
                : 'Your review has been submitted for moderation.',
            'data'    => $this->reviewModel->findById($reviewId) // Return the saved review to React
        ];
    }

    /**
     * ADMIN FEATURE: If a user somehow bypasses the rules, the Admin can click
     * one button to ban the user AND instantly delete all their past reviews.
     */
    public function banUserAndCleanUp(int $userId, int $offensiveReviewId): array
    {
        if ($userId <= 0) {
            return ['success' => false, 'message' => 'Invalid User ID.'];
        }

        // 1. Ban the user account so they can't log in anymore
        $userBanned = $this->userModel->updateStatus($userId, 'banned');

        if (!$userBanned) {
            return ['success' => false, 'message' => 'Failed to ban the user.'];
        }

        // 2. Clean up: Delete every single review this user has ever posted
        // (Assume your Review model has a deleteAllByUserId method)
        $this->reviewModel->deleteAllByUserId($userId);

        return [
            'success' => true,
            'message' => 'User has been banned and all their reviews have been permanently deleted.'
        ];
    }
}