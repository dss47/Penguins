<?php

declare(strict_types=1);

final class ShelfService
{
    public function __construct(
        private readonly Shelf $shelfModel = new Shelf(), 
        private readonly ShelfItem $shelfItemModel = new ShelfItem()
    ) {
    }

    /**
     * Récupère toutes les collections d'un utilisateur et vérifie 
     * pour chacune si un outil spécifique (toolId) y est déjà présent.
     * Parfait pour générer une modale avec des Checkboxes côté React !
     */
    public function getUserShelvesWithStatus(int $userId, int $toolId): array
    {
        if ($userId <= 0 || $toolId <= 0) {
            return [];
        }

        // 1. On récupère toutes les "étagères" de l'utilisateur
        $shelves = $this->shelfModel->findByUserId($userId);

        // 2. On boucle pour vérifier si l'outil est dedans
        foreach ($shelves as &$shelf) {
            // On suppose que le modèle a une méthode `exists($shelfId, $toolId)` qui renvoie un booléen
            $shelf['is_in_shelf'] = $this->shelfItemModel->exists((int) $shelf['id'], $toolId);
        }

        return $shelves;
    }

    /**
     * Crée une nouvelle collection vide pour un utilisateur.
     */
    public function createEmptyShelf(string $name, int $userId): array
    {
        $cleanName = trim($name);

        if ($userId <= 0) {
            return ['success' => false, 'message' => 'Utilisateur non valide.'];
        }

        if (empty($cleanName)) {
            return ['success' => false, 'message' => 'Le nom de la collection ne peut pas être vide.'];
        }

        $shelfId = $this->shelfModel->create([
            'user_id' => $userId,
            'name'    => $cleanName
        ]);

        return [
            'success' => true,
            'message' => 'Collection créée avec succès.',
            'shelf'   => $this->shelfModel->findById($shelfId) // On renvoie la nouvelle collection pour mettre à jour React
        ];
    }

    /**
     * Ajoute ou retire un outil d'une collection.
     * Le modèle gère la logique : S'il existe -> DELETE. S'il n'existe pas -> INSERT.
     * Retourne une string (ex: 'added', 'removed', ou 'error').
     */
    public function toggleShelfItem(int $shelfId, int $toolId): string
    {
        if ($shelfId <= 0 || $toolId <= 0) {
            return 'error';
        }

        // Votre modèle ShelfItem s'occupe du gros du travail ici !
        return $this->shelfItemModel->toggle($shelfId, $toolId);
    }
    
    /**
     * (Optionnel) Récupère tous les outils d'une collection spécifique.
     * Utile pour la page où l'utilisateur consulte le contenu de son "Étagère".
     */
    public function getToolsInShelf(int $shelfId, int $userId): array
    {
        if ($shelfId <= 0 || $userId <= 0) {
            return [];
        }
        
        // Vérification de sécurité : s'assurer que l'étagère appartient bien à l'utilisateur
        $shelf = $this->shelfModel->findById($shelfId);
        if (!$shelf || (int) $shelf['user_id'] !== $userId) {
            return []; // Accès refusé
        }

        return $this->shelfItemModel->getToolsByShelfId($shelfId);
    }
}