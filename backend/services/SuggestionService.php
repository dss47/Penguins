<?php

declare(strict_types=1);

final class SuggestionService
{
    /**
     * Traite la soumission du formulaire, l'enregistre, l'envoie à l'IA, 
     * et met à jour la base de données avec le verdict.
     */
    public function __construct(
        private readonly Suggestion $suggestionModel = new Suggestion(),
        private readonly OpenRouterService $openRouterService = new OpenRouterService(), // Nom mis à jour
        private readonly Category $categoryModel = new Category(),
        private readonly Provider $providerModel = new Provider(),
        private readonly AiModel $modelModel = new AiModel(),
        private readonly Feature $featureModel = new Feature()
    ) {
    }

    public function createSuggestion(array $payload): array
    {
        // 1. Sauvegarde initiale
        $suggestionId = $this->suggestionModel->create($payload);

        // 2. Préparation du contexte "Slim"
        $slimContext = $this->buildSlimDatabaseContext();

        // 3. Appel de l'IA (Correction ici ! 👇)
        $aiResponseJson = $this->openRouterService->evaluateToolSubmission($payload, $slimContext);

        // 4. Traitement de la réponse de l'IA
        if ($aiResponseJson) {
            $aiData = json_decode($aiResponseJson, true);
            
            if (isset($aiData['status'])) {
                $this->suggestionModel->updateFromAiValidation($suggestionId, $aiData);
                $updatedSuggestion = $this->suggestionModel->findById($suggestionId);
                
                return [
                    'success' => true,
                    'message' => 'Validation IA terminée.',
                    'data'    => $updatedSuggestion
                ];
            }
        }

        // 5. FALLBACK
        $this->suggestionModel->updateStatus($suggestionId, 'pending_manager', 'Erreur API IA. Validation manuelle requise.');
        $fallbackSuggestion = $this->suggestionModel->findById($suggestionId);

        return [
            'success' => false,
            'message' => 'L\'IA n\'a pas pu valider l\'outil. Transféré à l\'équipe de modération.',
            'data'    => $fallbackSuggestion
        ];
    }
    /**
     * Récupère toutes les suggestions en attente de validation par un manager
     * (Ce qui inclut les soumissions "approuvées" par l'IA mais qui attendent 
     * le clic final de l'admin, ou celles tombées en fallback).
     */
    public function listPendingSuggestions(): array
    {
        return array_merge(
            $this->suggestionModel->allByStatus('approved'), // IA a dit oui, attend l'admin
            $this->suggestionModel->allByStatus('pending_manager') // Mode Fallback
        );
    }

    /**
     * Génère des listes optimisées [ID => Nom] pour ne pas gaspiller
     * de tokens lors de l'appel à l'API OpenRouter.
     */
    private function buildSlimDatabaseContext(): array
    {
        // Note: Remplacez ces appels par la vraie méthode de vos modèles
        // qui retourne les données. Ex: $this->categoryModel->all();
        $rawCategories = $this->categoryModel->all();
        $rawProviders  = $this->providerModel->all();
        $rawModels     = $this->modelModel->all();
        $rawFeatures   = $this->featureModel->all();

        // Fonction utilitaire pour transformer un tableau complet en [id => name]
        $formatter = fn($array) => array_column($array, 'name', 'id');

        return [
            'categories' => $formatter($rawCategories),
            'providers'  => $formatter($rawProviders),
            'models'     => $formatter($rawModels),
            'features'   => $formatter($rawFeatures),
        ];
    }
}