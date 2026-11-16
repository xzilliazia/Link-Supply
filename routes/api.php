<?php

use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\ProductsApiController;
use Illuminate\Support\Facades\Route;

Route::get('/products', [ProductsApiController::class, 'index'])->name('api.products.index');

Route::get('/orders/create', [CheckoutController::class, 'create'])->name('api.orders.create');
Route::post('/orders', [CheckoutController::class, 'store'])->name('api.orders.store');
Route::get('/orders/{order}/edit', [CheckoutController::class, 'edit'])->name('api.orders.edit');
Route::put('/orders/{order}', [CheckoutController::class, 'update'])->name('api.orders.update');
Route::patch('/orders/{order}', [CheckoutController::class, 'update']);
Route::delete('/orders/{order}', [CheckoutController::class, 'destroy'])->name('api.orders.destroy');
