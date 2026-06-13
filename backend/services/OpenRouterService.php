<?php

declare(strict_types=1);

final class OpenRouterService
{
    private string $apiKey;
    private string $apiUrl;
    
    // Priority queue of AI models: if the first fails or is rate-limited, the next is tried
    private array $modelQueue = [
        'claude-opus-4-6',
        'glm-5.1',
    ];

    public function __construct()
    {
        $config = require __DIR__ . '/../config/env.php';
        
        $this->apiUrl = $config['ai_base_url'];
        $this->apiKey = $config['ai_api_key']; 
    }

    // Moderates a user comment/review for inappropriate content via AI
    public function moderateComment(string $comment): array
    {
        $systemPrompt = "Tu es un modérateur de contenu. Analyse le commentaire suivant et détermine s'il contient du spam, des insultes, du harcèlement, un langage inapproprié ou tout contenu violant les règles d'une communauté d'IA.
Réponds UNIQUEMENT en JSON strict avec cette structure exacte:
{
  \"flagged\": false,
  \"reason\": \"\",
  \"confidence_score\": 0
}

Si le contenu est problématique, mets flagged à true, donne la raison et un score de confiance entre 0 et 100.
Si le contenu est sain et respectueux, mets flagged à false.";
        $userMessage = "Commentaire à modérer : " . $comment;

        foreach ($this->modelQueue as $model) {
            $response = $this->attemptRequest($model, $systemPrompt, $userMessage);
            if ($response !== null) {
                $decoded = json_decode($response, true);
                if ($decoded && isset($decoded['flagged'])) {
                    return [
                        'flagged' => (bool) $decoded['flagged'],
                        'reason' => $decoded['reason'] ?? '',
                        'confidence_score' => (int) ($decoded['confidence_score'] ?? 0),
                    ];
                }
                return ['flagged' => false, 'reason' => '', 'confidence_score' => 0];
            }
            error_log("AgentRouter moderateComment: Modèle $model a échoué. Essai du modèle suivant...");
        }

        return ['flagged' => false, 'reason' => 'API IA indisponible, modération allégée', 'confidence_score' => 0];
    }

    // Evaluates a tool submission against existing database records via AI
    public function evaluateToolSubmission(array $toolData, array $slimContext): ?string
    {
        set_time_limit(120);

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

    // Gets AI recommendations: sends user prompt and tool list, returns selected tool IDs, title, and reasoning
    public function getRecommendations(string $prompt, array $toolsData): ?array
    {
        set_time_limit(120);

        $toolsJson = json_encode($toolsData, JSON_UNESCAPED_UNICODE);

        $systemPrompt = "Tu es un expert en outils d'intelligence artificielle.
Ton but est de recommander les meilleurs outils parmi la liste fournie pour répondre au besoin de l'utilisateur.

RÈGLES :
1. Choisis un maximum de 6 outils pertinents dans la liste.
2. Si le besoin est trop vague ou ne correspond à aucun outil, choisis-en moins ou aucun.
3. Utilise UNIQUEMENT les IDs présents dans la liste fournie. N'invente jamais d'ID.
4. Donne un titre très court, en 2 à 5 mots, qui résume la recherche.
5. Retourne uniquement un JSON strict avec cette structure :
{
  \"tool_ids\": [1, 5, 12],
  \"title\": \"Édition vidéo IA\",
  \"reasoning\": \"Explication courte et claire du choix.\"
}

Liste des outils disponibles, au format {id, name} :
$toolsJson";

        $userMessage = "Besoin de l'utilisateur : " . $prompt;

        foreach ($this->modelQueue as $model) {
            $response = $this->attemptRequest($model, $systemPrompt, $userMessage);
            
            if ($response !== null) {
                $decoded = json_decode($response, true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded) && isset($decoded['tool_ids'], $decoded['title'], $decoded['reasoning']) && is_array($decoded['tool_ids'])) {
                    return $decoded;
                }
                error_log('OpenRouterService::getRecommendations invalid JSON: ' . json_last_error_msg() . ' | Response: ' . substr($response, 0, 500));
            }
        }
        return null;
    }

    // Attempts a single API request to the given model with system prompt and user message
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
            CURLOPT_TIMEOUT        => 90,
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
                $stripped = preg_replace('/^```(?:json)?\s*\n?(.*?)\n?```\s*$/s', '$1', trim($rawContent));
            return $stripped ?: $rawContent;
        }

        return null;
    }

    // Builds the system prompt for tool evaluation, embedding the database context as JSON
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
