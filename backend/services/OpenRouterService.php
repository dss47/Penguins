<?php

declare(strict_types=1);

final class OpenRouterService
{
    private string $apiKey;
    private string $apiUrl;
    
    /**
     * Priority queue updated for AgentRouter supported models.
     * If the first model fails or is rate-limited, it tries the second one!
     */
    private array $modelQueue = [
        'claude-opus-4-6', // Premier choix : supporte endpoint openai
        'glm-5.1',         // Deuxième choix (fallback) si le premier est surchargé
    ];

    public function __construct()
    {
        // On charge la configuration centralisée depuis ton fichier env.php
        $config = require __DIR__ . '/../config/env.php';
        
        $this->apiUrl = $config['ai_base_url'];
        $this->apiKey = $config['ai_api_key']; 
    }

    /**
     * Evaluates a tool submission against the database lists.
     */
    public function evaluateToolSubmission(array $toolData, array $slimContext): ?string
    {
        $systemPrompt = $this->buildSystemPrompt($slimContext);
        $userMessage = "Évalue cet outil :\nNom: {$toolData['name']}\nURL: {$toolData['website_url']}\nDescription: {$toolData['description']}\nCatégorie sélectionnée ID: {$toolData['category_id']}\nFournisseur sélectionné ID: {$toolData['provider_id']}\nDate de sortie: {$toolData['release_date']}\nModèles: {$toolData['model_ids']}";

        foreach ($this->modelQueue as $model) {
            $response = $this->attemptRequest($model, $systemPrompt, $userMessage);
            
            if ($response !== null) {
                return $response; // Return immediately on success!
            }
            
            error_log("AgentRouter: Modèle $model a échoué. Essai du modèle suivant...");
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
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_TIMEOUT        => 25,
            CURLOPT_HTTPHEADER     => [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $this->apiKey,
                'User-Agent: claude-cli/1.0.108 (external, cli)',
                'anthropic-version: 2023-06-01',
                'anthropic-beta: claude-code-20250219,oauth-2025-04-20',
                'anthropic-dangerous-direct-browser-access: true',
                'x-app: cli',
                'X-Stainless-Lang: js',
                'X-Stainless-Package-Version: 0.55.1',
                'X-Stainless-OS: Linux',
                'X-Stainless-Arch: x64',
                'X-Stainless-Runtime: node',
                'X-Stainless-Runtime-Version: v22.0.0',
            ]
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);

        if ($httpCode !== 200) {
            error_log("AgentRouter attemptRequest — Modèle: {$model} | HTTP: {$httpCode} | cURL: {$curlError} | Réponse: " . substr($response ?: 'empty', 0, 300));
        }

        if ($httpCode === 200 && $response) {
            $decodedData = json_decode($response, true);
            $rawContent = $decodedData['choices'][0]['message']['content'] ?? null;
            if ($rawContent === null) return null;
            // Strip Markdown code fences if the AI wraps JSON in ```json ... ```
            $stripped = preg_replace('/^```(?:json)?\s*\n?(.*?)\n?```\s*$/s', '$1', trim($rawContent));
            return $stripped ?: $rawContent;
        }

        return null;
    }

    private function buildSystemPrompt(array $context): string
    {
        $catJson = json_encode($context['categories'], JSON_UNESCAPED_UNICODE);
        $provJson = json_encode($context['providers'], JSON_UNESCAPED_UNICODE);
        $toolsJson = json_encode($context['tools'] ?? [], JSON_UNESCAPED_UNICODE);
        $modelsJson = json_encode($context['models'] ?? [], JSON_UNESCAPED_UNICODE);
        
        return "Tu es un modérateur expert pour un annuaire d'IA.
Ton but est de valider les outils soumis par les administrateurs.

RÈGLES STRICTES — NE REJETTE PAS POUR DES DÉTAILS MINEURS :

- Si le nom est un peu générique mais correspond à un outil IA existant connu → approuve et corrige le nom via fixed_name
- Si l'URL ne commence pas par http:// ou https:// → corrige-la via fixed_url plutôt que rejeter
- Si la catégorie ou le fournisseur ne correspond pas exactement → corrige via fixed_category_id / fixed_provider_id
- Si le modèle ne correspond pas exactement → corrige via fixed_model_ids
- Si la date de sortie est incorrecte → corrige via fixed_release_date
- Tu DISPOSES de ces IDs — utilise-les toujours :
  Catégories: $catJson
  Fournisseurs: $provJson
  Modèles disponibles: $modelsJson

REJETTE (status: \"ai_rejected\") UNIQUEMENT DANS CES CAS :
1. Le nom ne correspond à AUCUN outil IA existant ou connu (inventé, hors-sujet)
2. L'URL est totalement invalide (pas une URL, chaîne vide, ou texte sans rapport)
3. L'outil existe DÉJÀ dans l'annuaire (liste des outils existants: $toolsJson)
4. La soumission n'est clairement pas un outil d'IA (spam, sujet non-IA)

DANS TOUS LES AUTRES CAS → status: \"ai_approved_pending_review\" avec les corrections appropriées dans les champs fixed_*.

Outils déjà présents dans l'annuaire: $toolsJson

Retourne un objet JSON strict avec cette structure exacte:
{
  \"status\": \"ai_approved_pending_review\" ou \"ai_rejected\",
  \"rejection_reason\": \"...\" (requis si rejeté, expliquer clairement pourquoi, null sinon),
  \"ai_moderation_notes\": \"...\" (notes détaillées sur tous les changements effectués : avant → après pour chaque champ modifié, null si rien),
  \"fixed_name\": \"...\" (nom corrigé si besoin, null sinon),
  \"fixed_url\": \"...\" (URL nettoyée si besoin, null sinon),
  \"fixed_category_id\": ID (ID de la catégorie corrigée, null si inchangé),
  \"fixed_provider_id\": ID (ID du fournisseur corrigé, null si inchangé),
  \"fixed_model_ids\": [ID1, ID2] (IDs des modèles corrigés sous forme de tableau JSON, null si inchangé),
  \"global_rating\": 4.5 (note /5 sur la qualité générale de l'outil, entre 1.0 et 5.0, toujours requis),
  \"fixed_release_date\": \"2024-01-15\" (date de sortie corrigée si besoin, null sinon)
}";
    }
}