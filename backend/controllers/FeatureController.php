<?php

declare(strict_types=1);

final class FeatureController
{
    public function __construct(private readonly FeatureService $featureService = new FeatureService())
    {
    }
}
