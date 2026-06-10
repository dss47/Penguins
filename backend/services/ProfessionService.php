<?php

declare(strict_types=1);

final class ProfessionService
{
    public function __construct(private readonly Profession $professionModel = new Profession())
    {
    }
}
