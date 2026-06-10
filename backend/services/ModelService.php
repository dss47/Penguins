<?php

declare(strict_types=1);

final class ModelService
{
    public function __construct(private readonly Model $modelModel = new Model())
    {
    }
}
