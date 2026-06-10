<?php

declare(strict_types=1);

final class CategoryController
{
    public function __construct(private readonly CategoryService $categoryService = new CategoryService())
    {
    }
}
