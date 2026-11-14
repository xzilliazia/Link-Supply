<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table): void {
            $table->foreignId('category_id')
                ->nullable()
                ->after('id')
                ->constrained('categories')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
        });

        $products = DB::table('products')
            ->select(['id', 'category', 'category_label', 'category_icon'])
            ->orderBy('id')
            ->get();

        foreach ($products as $product) {
            DB::table('categories')->insertOrIgnore([
                'slug' => $product->category,
                'name' => $product->category_label,
                'icon' => $product->category_icon,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $categoryId = DB::table('categories')
                ->where('slug', $product->category)
                ->value('id');

            DB::table('products')
                ->where('id', $product->id)
                ->update(['category_id' => $categoryId]);
        }

        Schema::table('products', function (Blueprint $table): void {
            $table->unsignedBigInteger('category_id')->nullable(false)->change();
            $table->dropIndex('products_category_index');
            $table->dropColumn(['category', 'category_label', 'category_icon']);
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table): void {
            $table->string('category')->nullable();
            $table->string('category_label')->nullable();
            $table->string('category_icon')->nullable();
        });

        $products = DB::table('products')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->select([
                'products.id',
                'categories.slug',
                'categories.name',
                'categories.icon',
            ])
            ->get();

        foreach ($products as $product) {
            DB::table('products')->where('id', $product->id)->update([
                'category' => $product->slug,
                'category_label' => $product->name,
                'category_icon' => $product->icon ?? 'wheat',
            ]);
        }

        Schema::table('products', function (Blueprint $table): void {
            $table->string('category')->nullable(false)->change();
            $table->string('category_label')->nullable(false)->change();
            $table->string('category_icon')->default('wheat')->nullable(false)->change();
            $table->index('category');
            $table->dropConstrainedForeignId('category_id');
        });
    }
};
