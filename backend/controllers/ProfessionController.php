<?php

declare(strict_types=1);

final class ProfessionController
{
    public function __construct(private readonly ProfessionService $professionService = new ProfessionService())
    {
    }
}
