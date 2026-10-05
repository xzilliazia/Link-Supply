<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Services\ProductCatalog;
use Illuminate\Contracts\View\View;

final class CatalogController extends Controller
{
    public function index(ProductCatalog $catalog): View
    {
        $catalogProducts = $catalog->all();

        return view('catalog', [
            'catalogProducts' => $catalogProducts,
            'catalogProductData' => array_map(
                static fn (Product $product): array => $product->toArray(),
                $catalogProducts
            ),
        ]);
    }
}
