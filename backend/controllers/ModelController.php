<?php

declare(strict_types=1);

final class ModelController
{
    public function __construct(private readonly ModelService $modelService = new ModelService())
    {
    }
}
