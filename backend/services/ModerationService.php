<?php

declare(strict_types=1);

final class ModerationService
{
    public function moderate(string $content): array
    {
        return [
            'flagged' => false,
            'categories' => [],
        ];
    }
}