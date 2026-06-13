<?php

declare(strict_types=1);

final class AuthMiddleware
{
	public function __construct(private readonly JwtService $jwtService = new JwtService())
	{
	}

	// Extracts and validates the Bearer token from the Authorization header, returns decoded payload or null
	public function authenticate(): ?array
	{
		$authHeader = $_SERVER['HTTP_AUTHORIZATION']
			?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
			?? '';

		if (!preg_match('/^Bearer\s+(.+)$/i', $authHeader, $matches)) {
			return null;
		}

		return $this->jwtService->decode($matches[1]);
	}
}
