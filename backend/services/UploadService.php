<?php

declare(strict_types=1);

final class UploadService
{
    private string $baseDir;

    public function __construct()
    {
        // Base public directory
        $this->baseDir = realpath(__DIR__ . '/../public') ?: __DIR__ . '/../public';
    }

    /**
     * Handle single file upload.
     * 
     * @param array $file The $_FILES['input_name'] array
     * @param string $destinationFolder e.g. 'uploads/tools' or 'uploads/userProfile'
     * @return array ['success' => bool, 'path' => string|null, 'error' => string|null]
     */
    public function handleUpload(array $file, string $destinationFolder): array
    {
        if (!isset($file['error']) || is_array($file['error'])) {
            return ['success' => false, 'error' => 'Paramètres invalides.'];
        }

        switch ($file['error']) {
            case UPLOAD_ERR_OK:
                break;
            case UPLOAD_ERR_NO_FILE:
                return ['success' => false, 'error' => 'Aucun fichier envoyé.'];
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                return ['success' => false, 'error' => 'La taille de fichier dépasse la limite autorisée.'];
            default:
                return ['success' => false, 'error' => 'Erreur inconnue lors de l\'upload.'];
        }

        // Max size 5MB
        if ($file['size'] > 5242880) {
            return ['success' => false, 'error' => 'La taille du fichier dépasse 5MB.'];
        }

        // Check MIME type
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($file['tmp_name']);
        $allowedTypes = [
            'jpg' => 'image/jpeg',
            'png' => 'image/png',
            'webp' => 'image/webp',
        ];

        $ext = array_search($mime, $allowedTypes, true);

        if (false === $ext) {
            return ['success' => false, 'error' => 'Format de fichier non valide (JPG, PNG, WebP uniquement).'];
        }

        // Create directory if not exists
        $targetDir = $this->baseDir . '/' . trim($destinationFolder, '/');
        if (!is_dir($targetDir)) {
            if (!mkdir($targetDir, 0755, true) && !is_dir($targetDir)) {
                return ['success' => false, 'error' => 'Impossible de créer le dossier de destination.'];
            }
        }

        // Generate unique filename
        $filename = uniqid('img_', true) . '.' . $ext;
        $targetPath = $targetDir . '/' . $filename;
        
        // Relative path to store in DB
        $relativePath = '/' . trim($destinationFolder, '/') . '/' . $filename;

        if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
            return ['success' => false, 'error' => 'Échec de la sauvegarde du fichier sur le serveur.'];
        }

        return ['success' => true, 'path' => $relativePath];
    }
}
