<?php

require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/../models/ProductCatalog.php';
require_once __DIR__ . '/../views/ProductDetailView.php';
require_once __DIR__ . '/../views/ViewHelper.php';

final class ProductController
{
    public function show(?int $id): void
    {
        $product = $id !== null ? (new ProductCatalog())->findById($id) : null;

        if ($product === null) {
            http_response_code(404);
        }

        $pageTitle = $product?->getName() ?? 'Produk tidak ditemukan';
        if ($product !== null) {
            $productView = $product->toDetailView();
            $productData = $product->toArray();
        }

        $detailView = new ProductDetailView();
        require __DIR__ . '/../views/product.php';
    }
}
