<?php

declare(strict_types=1);

final class ProviderController
{
    public function __construct(private readonly ProviderService $providerService = new ProviderService())
    {
    }
}
