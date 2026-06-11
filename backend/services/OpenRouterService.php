<?php

declare(strict_types=1);

final class OpenRouterService
{
    private string $apiKey;
    private string $apiUrl = 'https://openrouter.ai/api/v1/chat/completions';
    
    // A priority queue. If the first model is down, it instantly tries the second one!
    private array $modelQueue = [
        'google/gemini-1.5-flash',
        'anthropic/claude-3.5-sonnet',
        'meta-llama/llama-3-8b-instruct:free' // Free fallback model
    ];

    public function __construct()
    {
        // Ideally loaded from a .env or config file
        $this->apiKey = 'VOTRE_NOUVELLE_CLE_API'; 
    }

    /**
     * Evaluates a tool submission against the database lists.
     */
    public function evaluateToolSubmission(array $toolData, array $slimContext): ?string
    {
        $systemPrompt = $this->buildSystemPrompt($slimContext);
        $userMessage = "Évalue cet outil :\nNom: {$toolData['name']}\nURL: {$toolData['website_url']}\nDescription: {$toolData['description']}";

        foreach ($this->modelQueue as $model) {
            $response = $this->attemptRequest($model, $systemPrompt, $userMessage);
            
            if ($response !== null) {
                return $response; // Return immediately on success!
            }
            
            error_log("OpenRouter: Modèle $model a échoué. Essai du modèle suivant...");
        }

        // Return null if ALL models in the queue failed
        return null; 
    }

    private function attemptRequest(string $model, string $systemPrompt, string $userMessage): ?string
    {
        $payload = [
            'model' => $model,
            'response_format' => ['type' => 'json_object'], // Forces the AI to return strict JSON
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user', 'content' => $userMessage]
            ]
        ];

        $ch = curl_init($this->apiUrl);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => json_encode($payload),
            CURLOPT_TIMEOUT        => 15, // 15 seconds max before giving up and trying the next model
            CURLOPT_HTTPHEADER     => [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $this->apiKey,
                'HTTP-Referer: https://penguin-directory.com',
                'X-Title: Penguin AI Directory'
            ]
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 200 && $response) {
            $decodedData = json_decode($response, true);
            return $decodedData['choices'][0]['message']['content'] ?? null;
        }

        return null;
    }

    private function buildSystemPrompt(array $context): string
    {
        // Convert the PHP arrays to JSON strings for the prompt
        $catJson = json_encode($context['categories'], JSON_UNESCAPED_UNICODE);
        $provJson = json_encode($context['providers'], JSON_UNESCAPED_UNICODE);
        
        return "Tu es un modérateur expert pour un annuaire d'IA. 
Ton but est de valider les outils soumis.
Utilise EXCLUSIVEMENT ces IDs:
Catégories: $catJson
Fournisseurs: $provJson

Retourne un objet JSON strict:
{
  \"status\": \"approved\" ou \"rejected_ai\",
  \"rejection_reason\": \"...\",
  \"ai_moderation_notes\": \"...\",
  \"fixed_category_id\": ID
}";
    }
}