<?php

declare(strict_types=1);

final class ModerationService
{
    /**
     * Liste noire locale de mots ou d'expressions interdites.
     * Permet un filtrage ultra-rapide (0 milliseconde) avant même d'appeler une API.
     */
    private array $bannedKeywords = [
        'viagra', 'casino en ligne', 'hack', 'mot_interdit_1', 'mot_interdit_2'
    ];

    /**
     * Analyse un contenu (texte, avis, description) et détermine s'il est sûr.
     */
    public function moderate(string $content): array
    {
        $cleanContent = trim($content);

        // 1. Si c'est vide, pas besoin de flagger
        if (empty($cleanContent)) {
            return [
                'flagged' => false,
                'categories' => [],
            ];
        }

        // 2. Vérification locale ultra-rapide (Expressions régulières ou mots-clés)
        $localCheck = $this->localKeywordCheck($cleanContent);
        if ($localCheck['flagged']) {
            return $localCheck;
        }

        // 3. (Optionnel) Vérification avancée via IA (OpenRouter / Llama Guard 3)
        // Décommentez et ajustez si vous souhaitez utiliser une IA pour lire entre les lignes
        // return $this->aiModerationCheck($cleanContent);

        // Si tout va bien, le contenu est approuvé
        return [
            'flagged' => false,
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
     * Squelette pour une vérification IA approfondie (ex: Llama Guard 3 via OpenRouter).
     */
    private function aiModerationCheck(string $content): array
    {
        // Ici, vous pourriez réutiliser votre OpenRouterService avec un prompt strict :
        // "Analyse ce texte. Est-ce du spam, de la haine, ou du harcèlement ? Réponds en JSON."
        
        // Simulation d'une réponse d'API
        $aiThinksItsSpam = false; 
        
        if ($aiThinksItsSpam) {
            return [
                'flagged' => true,
                'categories' => ['spam', 'ai_detected']
            ];
        }

        return [
            'flagged' => false,
            'categories' => []
        ];
    }
}