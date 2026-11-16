<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProductsApiController;

Route::get('/', [CatalogController::class, 'index'])->name('catalog.index');
Route::get('/products/{id}', [ProductController::class, 'show'])
    ->whereNumber('id')
    ->name('products.show');
Route::get('/api/products', [ProductsApiController::class, 'index'])
    ->name('api.products.index');
Route::view('/payment.html', 'payment')->name('checkout');
