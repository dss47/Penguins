<?php

declare(strict_types=1);

final class UserService
{
    // Durée de la période de grâce avant suppression définitive (en jours)
    private const GRACE_PERIOD_DAYS = 30;

    public function __construct(
        private readonly User $userModel = new User(),
        private readonly UploadService $uploadService = new UploadService()
    ) {
    }

    /**
     * Met à jour le profil de l'utilisateur, incluant la photo de profil.
     */
    public function updateProfile(int $userId, array $data, ?array $file = null): array
    {
        if ($file && $file['error'] !== UPLOAD_ERR_NO_FILE) {
            $uploadResult = $this->uploadService->handleUpload($file, 'uploads/userProfile');
            if (!$uploadResult['success']) {
                return ['success' => false, 'message' => $uploadResult['error']];
            }
            $data['profile_url'] = $uploadResult['path'];
            
            // Delete old profile picture if exists
            $oldUser = $this->userModel->findById($userId);
            if ($oldUser && !empty($oldUser['profile_url']) && str_starts_with($oldUser['profile_url'], '/uploads/')) {
                $oldPath = realpath(__DIR__ . '/../public' . $oldUser['profile_url']);
                if ($oldPath && file_exists($oldPath)) {
                    unlink($oldPath);
                }
            }
        }

        $updated = $this->userModel->update($userId, $data);

        if (!$updated) {
            return ['success' => false, 'message' => 'Erreur lors de la mise à jour du profil.'];
        }

        return ['success' => true, 'message' => 'Profil mis à jour avec succès.', 'profile_url' => $data['profile_url'] ?? null];
    }

    /**
     * Planifie la suppression du compte utilisateur.
     * Le compte n'est pas effacé, mais mis en "attente de suppression".
     */
    public function scheduleDeletion(int $userId): array
    {
        if ($userId <= 0) {
            return ['success' => false, 'message' => 'ID Utilisateur invalide.'];
        }

        // Calcule la date exacte de suppression définitive (Aujourd'hui + 30 jours)
        $scheduledDate = date('Y-m-d H:i:s', strtotime('+' . self::GRACE_PERIOD_DAYS . ' days'));

        // Suppose que votre modèle a une méthode pour mettre à jour le statut et la date de suppression
        // Ex: UPDATE users SET status = 'pending_deletion', deletion_scheduled_at = ? WHERE id = ?
        $updated = $this->userModel->scheduleDeletion($userId, $scheduledDate);

        if (!$updated) {
            return [
                'success' => false,
                'message' => 'Impossible de planifier la suppression du compte.'
            ];
        }

        return [
            'success' => true,
            'message' => 'Votre compte a été désactivé. Il sera définitivement supprimé le ' . date('d/m/Y', strtotime($scheduledDate)) . '. Vous pouvez vous reconnecter d\'ici là pour annuler la suppression.',
            'scheduled_date' => $scheduledDate
        ];
    }

    /**
     * Annule la suppression et restaure le compte si l'utilisateur se reconnecte 
     * pendant la période de grâce.
     */
    public function restoreAccount(int $userId): array
    {
        if ($userId <= 0) {
            return ['success' => false, 'message' => 'ID Utilisateur invalide.'];
        }

        // Suppose que le modèle remet le statut à 'active' et nullifie 'deletion_scheduled_at'
        $restored = $this->userModel->restoreAccount($userId);

        if (!$restored) {
            return [
                'success' => false,
                'message' => 'Impossible de restaurer ce compte. Il est peut-être déjà définitivement supprimé.'
            ];
        }

        return [
            'success' => true,
            'message' => 'Bon retour ! La suppression de votre compte a été annulée avec succès.'
        ];
    }

    /**
     * Traite les suppressions définitives.
     * Cette méthode ne sera pas appelée par React, mais par un script CRON sur votre serveur !
     * Elle supprime tous les comptes dont la date `deletion_scheduled_at` est dépassée.
     * * @return int Le nombre de comptes qui ont été supprimés.
     */
    public function processPermanentDeletions(): int
    {
        // Suppose que votre modèle récupère les IDs des utilisateurs dont le temps est écoulé
        // Ex: SELECT id FROM users WHERE status = 'pending_deletion' AND deletion_scheduled_at <= NOW()
        $usersToDelete = $this->userModel->getUsersReadyForPermanentDeletion();

        $deletedCount = 0;

        foreach ($usersToDelete as $user) {
            $userId = (int) $user['id'];
            
            // Note : Une vraie suppression définitive demande souvent de nettoyer d'autres tables
            // (ex: effacer l'avatar du serveur, anonymiser les commentaires, etc.)
            $success = $this->userModel->deletePermanently($userId);
            
            if ($success) {
                $deletedCount++;
            }
        }

        return $deletedCount;
    }
}