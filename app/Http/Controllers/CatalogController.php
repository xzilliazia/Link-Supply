<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Services\ProductCatalog;
use Illuminate\Contracts\View\View;

final class CatalogController extends Controller
{
    public function index(ProductCatalog $catalog): View
    {
        $catalogProducts = $catalog->all();
        $catalogProductData = $catalogProducts
            ->map(static fn (Product $product): array => (new ProductResource($product))->resolve())
            ->all();

        return view('catalog', [
            'catalogProducts' => $catalogProducts,
            'catalogProductData' => $catalogProductData,
        ]);
    }
}
