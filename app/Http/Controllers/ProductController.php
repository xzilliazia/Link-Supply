<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Services\ProductCatalog;
use Illuminate\Http\Response;

final class ProductController extends Controller
{
    /**
     * Display the product detail page.
     *
     * Resolves the product manually so we can render our own branded 404 view
     * rather than Laravel's generic error page when a product is not found.
     */
    public function show(int $product, ProductCatalog $catalog): Response
    {
        $found = $catalog->findById($product);
        $productData = $found ? (new ProductResource($found))->resolve() : null;

        return response()->view('product', [
            'product' => $found,
            'productData' => $productData,
        ], $found === null ? 404 : 200);
    }
}
