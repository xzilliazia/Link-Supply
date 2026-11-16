<?php

require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/../models/ProductCatalog.php';

final class ProductsApiController
{
    public function index(): void
    {
        $products = array_map(
            static fn (Product $product): array => $product->toArray(),
            (new ProductCatalog())->all()
        );

        header('Content-Type: application/json; charset=utf-8');

        echo json_encode([
            'success' => true,
            'message' => 'Katalog produk berhasil dimuat.',
            'data' => $products,
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    }
}
