<?php

declare(strict_types=1);

final class JwtService
{
	private string $secret;

	public function __construct()
	{
		$config = require __DIR__ . '/../config/env.php';
		$this->secret = $config['jwt_secret'] ?: 'penguin-default-secret-change-me';
	}

	public function generateToken(array $payload): string
	{
		$header = self::base64urlEncode(json_encode(['alg' => 'HS256', 'typ' => 'JWT'], JSON_THROW_ON_ERROR));
		$payload['iat'] = time();
		$payload['exp'] = time() + 86400;
		$payloadEncoded = self::base64urlEncode(json_encode($payload, JSON_THROW_ON_ERROR));
		$signature = self::base64urlEncode(
			hash_hmac('sha256', "$header.$payloadEncoded", $this->secret, true)
		);
		return "$header.$payloadEncoded.$signature";
	}

	public function decode(string $token): ?array
	{
		$parts = explode('.', $token);
		if (count($parts) !== 3) {
			return null;
		}

		[$header, $payloadEncoded, $signature] = $parts;

		$expectedSignature = self::base64urlEncode(
			hash_hmac('sha256', "$header.$payloadEncoded", $this->secret, true)
		);

		if (!hash_equals($expectedSignature, $signature)) {
			return null;
		}

		$payload = json_decode(self::base64urlDecode($payloadEncoded), true);
		if (!$payload || !isset($payload['exp']) || $payload['exp'] < time()) {
			return null;
		}

		return $payload;
	}

	private static function base64urlEncode(string $data): string
	{
		return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
	}

	private static function base64urlDecode(string $data): string
	{
		return base64_decode(strtr($data, '-_', '+/'));
	}
}
