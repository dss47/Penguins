<?php

declare(strict_types=1);

final class JwtService
{
    public function generateToken(array $payload): string
    {
        return base64_encode(json_encode($payload, JSON_THROW_ON_ERROR));
    }
}