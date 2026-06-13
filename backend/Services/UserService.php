<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\User;
use App\Services\UploadService;



final class UserService
{
    // Grace period in days before permanent account deletion
    private const GRACE_PERIOD_DAYS = 30;

    public function __construct(
        private readonly User $userModel = new User(),
        private readonly UploadService $uploadService = new UploadService()
    ) {
    }

    // Updates the user's profile, including profile photo and password
    public function updateProfile(int $userId, array $data, ?array $file = null): array
    {
        if ($file && $file['error'] !== UPLOAD_ERR_NO_FILE) {
            $uploadResult = $this->uploadService->handleUpload($file, 'uploads/userProfile');
            if (!$uploadResult['success']) {
                return ['success' => false, 'message' => $uploadResult['error']];
            }
            $data['profile_url'] = $uploadResult['path'];
            
            $oldUser = $this->userModel->findById($userId);
            if ($oldUser && !empty($oldUser['profile_url']) && str_starts_with($oldUser['profile_url'], '/uploads/')) {
                $oldPath = realpath(__DIR__ . '/../public' . $oldUser['profile_url']);
                if ($oldPath && file_exists($oldPath)) {
                    unlink($oldPath);
                }
            }
        }

        $currentPassword = $data['current_password'] ?? '';
        $newPassword = $data['new_password'] ?? '';
        $newPasswordConfirmation = $data['new_password_confirmation'] ?? '';

        unset($data['current_password'], $data['new_password'], $data['new_password_confirmation']);

        if (!empty($currentPassword) || !empty($newPassword) || !empty($newPasswordConfirmation)) {
            if (empty($currentPassword)) {
                return ['success' => false, 'message' => 'Le mot de passe actuel est requis.'];
            }
            if (empty($newPassword)) {
                return ['success' => false, 'message' => 'Le nouveau mot de passe est requis.'];
            }
            if ($newPassword !== $newPasswordConfirmation) {
                return ['success' => false, 'message' => 'Les nouveaux mots de passe ne correspondent pas.'];
            }
            if (strlen($newPassword) < 6) {
                return ['success' => false, 'message' => 'Le mot de passe doit contenir au moins 6 caractères.'];
            }

            $user = $this->userModel->findById($userId);
            if (!$user || !password_verify($currentPassword, $user['password_hash'])) {
                return ['success' => false, 'message' => 'Mot de passe actuel incorrect.'];
            }

            $this->userModel->updatePassword($userId, password_hash($newPassword, PASSWORD_DEFAULT));
        }

        if (isset($data['name']) || isset($data['email']) || array_key_exists('profession_id', $data) || isset($data['profile_url'])) {
            $updateData = [];
            if (isset($data['name'])) $updateData['name'] = $data['name'];
            if (isset($data['email'])) $updateData['email'] = $data['email'];
            if (array_key_exists('profession_id', $data)) $updateData['profession_id'] = $data['profession_id'];
            if (isset($data['profile_url'])) $updateData['profile_url'] = $data['profile_url'];

            if (!empty($updateData)) {
                $current = $this->userModel->findById($userId);
                $updateData['name'] ??= $current['name'];
                $updateData['email'] ??= $current['email'];

                $updated = $this->userModel->update($userId, $updateData);
                if (!$updated) {
                    return ['success' => false, 'message' => 'Erreur lors de la mise à jour du profil.'];
                }
            }
        }

        return ['success' => true, 'message' => 'Profil mis à jour avec succès.', 'profile_url' => $data['profile_url'] ?? null];
    }

    // Schedules the user account for deletion after a grace period
    public function scheduleDeletion(int $userId): array
    {
        if ($userId <= 0) {
            return ['success' => false, 'message' => 'ID Utilisateur invalide.'];
        }

        $scheduledDate = date('Y-m-d H:i:s', strtotime('+' . self::GRACE_PERIOD_DAYS . ' days'));

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

    // Restores a user account that was scheduled for deletion during the grace period
    public function restoreAccount(int $userId): array
    {
        if ($userId <= 0) {
            return ['success' => false, 'message' => 'ID Utilisateur invalide.'];
        }

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

    // Processes permanent account deletions (intended for CRON, not React)
    public function processPermanentDeletions(): int
    {
        $usersToDelete = $this->userModel->getUsersReadyForPermanentDeletion();

        $deletedCount = 0;

        foreach ($usersToDelete as $user) {
            $userId = (int) $user['id'];
            
            $success = $this->userModel->deletePermanently($userId);
            
            if ($success) {
                $deletedCount++;
            }
        }

        return $deletedCount;
    }
}