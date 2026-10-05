<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\ProductCatalog;
use Illuminate\Http\JsonResponse;

final class ProductsApiController extends Controller
{
    public function index(ProductCatalog $catalog): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Katalog produk berhasil dimuat.',
            'data' => array_map(
                static fn (Product $product): array => $product->toArray(),
                $catalog->all()
            ),
        ]);
    }
}
