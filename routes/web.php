<?php

use App\Http\Controllers\CatalogController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::get('/', [CatalogController::class, 'index'])->name('catalog.index');

Route::get('/products/{product}', [ProductController::class, 'show'])
    ->whereNumber('product')
    ->name('products.show');

Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout');

// Keep legacy URL working as a redirect
Route::redirect('/payment.html', '/checkout');
