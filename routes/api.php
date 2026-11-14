<?php

use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ProductsApiController;
use Illuminate\Support\Facades\Route;

Route::get('/products', [ProductsApiController::class, 'index'])->name('api.products.index');

Route::post('/orders', [CheckoutController::class, 'store'])->name('api.orders.store');
