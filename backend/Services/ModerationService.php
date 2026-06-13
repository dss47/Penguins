<?php

declare(strict_types=1);

namespace App\Services;

use App\Services\OpenRouterService;



final class ModerationService
{
    public function __construct(private readonly OpenRouterService $openRouter = new OpenRouterService())
    {
    }

    // Local blacklist of banned keywords for ultra-fast filtering before calling the AI API
    private array $bannedKeywords = [
        'viagra', 'casino en ligne', 'hack', 'mot_interdit_1', 'mot_interdit_2'
    ];

    // Analyzes content (text, review, description) and determines if it is safe and clean
    public function moderate(string $content): array
    {
        $cleanContent = trim($content);

        if (empty($cleanContent)) {
            return [
                'flagged' => false,
                'reason' => '',
                'confidence_score' => 0,
                'categories' => [],
            ];
        }

        $localCheck = $this->localKeywordCheck($cleanContent);
        if ($localCheck['flagged']) {
            return [
                'flagged' => true,
                'reason' => 'Spam ou langage inapproprié détecté (liste noire locale)',
                'confidence_score' => 95,
                'categories' => $localCheck['categories'],
            ];
        }

        return $this->aiModerationCheck($cleanContent);

        return [
            'flagged' => false,
            'reason' => '',
            'confidence_score' => 0,
            'categories' => [],
        ];
    }

    // Checks whether the text contains any locally banned keywords
    private function localKeywordCheck(string $content): array
    {
        $flaggedCategories = [];
        $contentLower = strtolower($content);

        foreach ($this->bannedKeywords as $word) {
            if (strpos($contentLower, $word) !== false) {
                $flaggedCategories[] = 'spam_or_profanity';
                break;
            }
        }

        return [
            'flagged'    => !empty($flaggedCategories),
            'categories' => $flaggedCategories
        ];
    }

    // Performs an in-depth AI moderation check via OpenRouter
    private function aiModerationCheck(string $content): array
    {
        $result = $this->openRouter->moderateComment($content);

        return [
            'flagged'          => $result['flagged'],
            'reason'           => $result['reason'],
            'confidence_score' => $result['confidence_score'],
            'categories'       => $result['flagged'] ? ['ai_detected'] : [],
        ];
    }
}