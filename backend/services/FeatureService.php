<?php

declare(strict_types=1);

final class FeatureService
{
    public function __construct(private readonly Feature $featureModel = new Feature())
    {
    }
}
