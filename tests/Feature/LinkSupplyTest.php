<?php

namespace Tests\Feature;

use App\Models\Product;
use Database\Seeders\ProductSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LinkSupplyTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(ProductSeeder::class);
    }

    public function test_catalog_page_renders_products(): void
    {
        $this->get('/')
            ->assertOk()
            ->assertSee('Beras Pandan Wangi Premium')
            ->assertSee('/products/1');
    }

    public function test_product_api_returns_catalog_data(): void
    {
        $this->getJson('/api/products')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.0.id', 1)
            ->assertJsonPath('data.0.category', 'pertanian')
            ->assertJsonPath('data.0.categoryLabel', 'Pertanian')
            ->assertJsonPath('data.0.image', '/assets/images/pexels-shvets-production-8900041.jpg');
    }

    public function test_product_uses_a_category_relationship(): void
    {
        $product = Product::query()->with('category.products')->findOrFail(1);

        $this->assertSame('pertanian', $product->category->slug);
        $this->assertSame('Pertanian', $product->category->name);
        $this->assertTrue($product->category->products->contains('id', $product->id));
    }

    public function test_product_api_filters_by_category_and_search_term(): void
    {
        $this->getJson('/api/products?category=perikanan')
            ->assertOk()
            ->assertJsonPath('data.0.category', 'perikanan');

        $this->getJson('/api/products?search=beras')
            ->assertOk()
            ->assertJsonPath('data.0.name', 'Beras Pandan Wangi Premium');
    }

    public function test_product_api_rejects_non_string_filters(): void
    {
        $this->getJson('/api/products?search%5B%5D=beras')
            ->assertUnprocessable()
            ->assertJsonValidationErrors('search');
    }

    public function test_product_detail_renders_and_missing_product_is_not_found(): void
    {
        $this->get('/products/1')
            ->assertOk()
            ->assertSee('Beras Pandan Wangi Premium')
            ->assertSee('data-add-to-cart', false);

        $this->get('/products/99999')
            ->assertNotFound()
            ->assertSee('Produk yang Anda cari tidak ditemukan.');
    }

    public function test_checkout_page_is_available(): void
    {
        $this->get('/checkout')
            ->assertOk()
            ->assertSee('Konfirmasi & Pembayaran', false)
            ->assertSee('/api/orders', false)
            ->assertSee('/assets/images/pexels-shvets-production-8900041.jpg', false)
            ->assertDontSee('api/products.php');
    }

    public function test_order_creation_uses_database_price_and_deducts_stock(): void
    {
        $product = Product::query()->findOrFail(1);
        $originalStock = $product->stock;

        $this->postJson('/api/orders', $this->validOrderPayload([
            'items' => [[
                'product_id' => $product->id,
                'quantity' => $product->min_order,
                'price' => 1,
            ]],
        ]))
            ->assertCreated()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.items.0.unit_price', $product->price)
            ->assertJsonPath('data.items.0.line_total', $product->price * $product->min_order)
            ->assertJsonPath('data.total', $product->price * $product->min_order);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock' => $originalStock - $product->min_order,
        ]);
        $this->assertDatabaseCount('orders', 1);
        $this->assertDatabaseCount('order_items', 1);
    }

    public function test_order_with_insufficient_stock_is_rejected_without_partial_changes(): void
    {
        $product = Product::query()->findOrFail(1);
        $originalStock = $product->stock;

        $this->postJson('/api/orders', $this->validOrderPayload([
            'items' => [[
                'product_id' => $product->id,
                'quantity' => $originalStock + 1,
            ]],
        ]))
            ->assertUnprocessable()
            ->assertJsonValidationErrors('items.0.quantity');

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock' => $originalStock,
        ]);
        $this->assertDatabaseCount('orders', 0);
        $this->assertDatabaseCount('order_items', 0);
    }

    public function test_checkout_payment_options_are_accepted_by_order_endpoint(): void
    {
        $product = Product::query()->findOrFail(1);

        foreach (['gopay', 'shopeepay', 'indomaret'] as $method) {
            $this->postJson('/api/orders', $this->validOrderPayload([
                'items' => [[
                    'product_id' => $product->id,
                    'quantity' => $product->min_order,
                ]],
                'payment_method' => $method,
            ]))->assertCreated();
        }
    }

    /** @return array<string, mixed> */
    private function validOrderPayload(array $overrides = []): array
    {
        return array_replace_recursive([
            'items' => [['product_id' => 1, 'quantity' => 1]],
            'recipient_name' => 'Test Recipient',
            'recipient_phone' => '081234567890',
            'shipping_street' => 'Test Street 1',
            'shipping_city' => 'Bandung',
            'shipping_province' => 'Jawa Barat',
            'shipping_postal_code' => '40111',
            'payment_method' => 'transfer_bca',
            'notes' => null,
        ], $overrides);
    }
}
