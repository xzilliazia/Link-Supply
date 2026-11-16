<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProductIndexRequest;
use App\Http\Resources\ProductResource;
use App\Services\ProductCatalog;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

final class ProductsApiController extends Controller
{
    /**
     * Return a JSON collection of all products, with optional filtering.
     *
     * Query parameters:
     *   - category (string) — filter by category slug
     *   - search   (string) — partial match on name, description, or location
     *   - province (string) — filter by province name
     */
    public function index(ProductIndexRequest $request, ProductCatalog $catalog): AnonymousResourceCollection
    {
        $products = $catalog->search($request->validated());

        return ProductResource::collection($products)
            ->additional([
                'success' => true,
                'message' => 'Katalog produk berhasil dimuat.',
            ]);
    }
}
