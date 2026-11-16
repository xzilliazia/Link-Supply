<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category')->index();
            $table->string('category_label');
            $table->string('category_icon')->default('wheat');
            $table->unsignedInteger('price');
            $table->string('price_unit')->default('kg');
            $table->unsignedInteger('min_order')->default(1);
            $table->string('min_order_unit')->default('kg');
            $table->integer('stock')->default(0);
            $table->string('stock_unit')->default('kg');
            $table->string('location');
            $table->string('province');
            $table->decimal('rating', 3, 1)->default(5.0);
            $table->string('sold_count')->default('0');
            $table->string('image');
            $table->text('description');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
