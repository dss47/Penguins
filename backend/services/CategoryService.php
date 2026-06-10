<?php

declare(strict_types=1);

final class CategoryService
{
    public function __construct(private readonly Category $categoryModel = new Category())
    {
    }
}
