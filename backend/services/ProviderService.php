<?php

declare(strict_types=1);

final class ProviderService
{
    public function __construct(private readonly Provider $providerModel = new Provider())
    {
    }
}
