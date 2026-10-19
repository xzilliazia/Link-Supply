<?php

require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/../models/ProductCatalog.php';
require_once __DIR__ . '/../views/ViewHelper.php';

final class CatalogController
{
    public function index(): void
    {
        $catalogProducts = (new ProductCatalog())->all();
        $catalogProductData = array_map(
            static fn (Product $product): array => $product->toArray(),
            $catalogProducts
        );

        require __DIR__ . '/../views/catalog.php';
    }
}
