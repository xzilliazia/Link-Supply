<?php

namespace App\Http\Controllers;

use App\Services\ProductCatalog;
use App\Support\ProductDetailView;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Response;

final class ProductController extends Controller
{
    public function show(ProductCatalog $catalog, int $id): View|Response
    {
        $product = $catalog->findById($id);
        $pageTitle = $product?->getName() ?? 'Produk tidak ditemukan';
        $productView = $product?->toDetailView();
        $productData = $product?->toArray();
        $detailView = new ProductDetailView();

        return response()->view('product', compact(
            'product',
            'pageTitle',
            'productView',
            'productData',
            'detailView'
        ), $product === null ? 404 : 200);
    }
}
