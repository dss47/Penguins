<?php

declare(strict_types=1);

final class ModerationService
{
    public function __construct(private readonly OpenRouterService $openRouter = new OpenRouterService())
    {
    }

    /**
     * Liste noire locale de mots ou d'expressions interdites.
     * Permet un filtrage ultra-rapide (0 milliseconde) avant même d'appeler une API.
     */
    private array $bannedKeywords = [
        'viagra', 'casino en ligne', 'hack', 'mot_interdit_1', 'mot_interdit_2'
    ];

    /**
     * Analyse un contenu (texte, avis, description) et détermine s'il est sûr.
     * Retourne un tableau avec: flagged (bool), reason (string), confidence_score (int), categories (array)
     */
    public function moderate(string $content): array
    {
        $cleanContent = trim($content);

        // 1. Si c'est vide, pas besoin de flagger
        if (empty($cleanContent)) {
            return [
                'flagged' => false,
                'reason' => '',
                'confidence_score' => 0,
                'categories' => [],
            ];
        }

        // 2. Vérification locale ultra-rapide (Expressions régulières ou mots-clés)
        $localCheck = $this->localKeywordCheck($cleanContent);
        if ($localCheck['flagged']) {
            return [
                'flagged' => true,
                'reason' => 'Spam ou langage inapproprié détecté (liste noire locale)',
                'confidence_score' => 95,
                'categories' => $localCheck['categories'],
            ];
        }

        // 3. Vérification avancée via IA (AgentRouter)
        return $this->aiModerationCheck($cleanContent);

        // Si tout va bien, le contenu est approuvé
        return [
            'flagged' => false,
            'reason' => '',
            'confidence_score' => 0,
            'categories' => [],
        ];
    }

    /**
     * Vérifie si le texte contient des mots de la liste noire.
     */
    private function localKeywordCheck(string $content): array
    {
        $flaggedCategories = [];
        $contentLower = strtolower($content);

        foreach ($this->bannedKeywords as $word) {
            if (strpos($contentLower, $word) !== false) {
                $flaggedCategories[] = 'spam_or_profanity';
                break; // On arrête à la première infraction pour gagner du temps
            }
        }

        return [
            'flagged'    => !empty($flaggedCategories),
            'categories' => $flaggedCategories
        ];
    }

    /**
     * Vérification IA approfondie via AgentRouter.
     */
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