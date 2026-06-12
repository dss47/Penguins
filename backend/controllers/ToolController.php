<?php

declare(strict_types=1);

final class ToolController
{
    public function __construct(
        private readonly ToolService $toolService = new ToolService(),
        private readonly Review $reviewModel = new Review(),
        private readonly AuthMiddleware $authMiddleware = new AuthMiddleware()
    ) {
    }

    public function index(): array
    {
        $name = $_GET['name'] ?? null;
        if ($name) {
            return $this->toolService->getPublicToolByName($name);
        }
        return Response::success($this->toolService->listPublicTools());
    }

    public function reviews(): array
    {
        $toolId = (int) ($_GET['tool_id'] ?? 0);
        if ($toolId <= 0) {
            return Response::error('ID d\'outil invalide');
        }

        $user = $this->authMiddleware->authenticate();
        $userId = $user ? (int) ($user['user_id'] ?? 0) : 0;

        $reviews = $this->reviewModel->allApprovedByToolId($toolId);

        $userReview = null;
        if ($userId > 0) {
            $userReview = $this->reviewModel->findByUserAndTool($userId, $toolId);
        }

        return Response::success([
            'reviews'     => $reviews,
            'user_review' => $userReview,
        ]);
    }

    public function topReviews(): array
    {
        return Response::success($this->reviewModel->topApprovedComments(3));
    }
}
