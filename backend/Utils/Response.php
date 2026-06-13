<?php

declare(strict_types=1);

namespace App\Utils;



final class Response
{
    public static function success(mixed $data = null, int $statusCode = 200): array
    {
        return [
            'success' => true,
            'status' => $statusCode,
            'data' => $data,
        ];
    }

    public static function created(mixed $data = null): array
    {
        return self::success($data, 201);
    }

    public static function error(string $message, int $statusCode = 400, mixed $details = null): array
    {
        return [
            'success' => false,
            'status' => $statusCode,
            'message' => $message,
            'details' => $details,
        ];
    }
}