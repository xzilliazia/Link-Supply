<?php

namespace Tests\Feature;

use Tests\TestCase;

class LinkSupplyTest extends TestCase
{
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
            ->assertJsonPath('data.0.image', '/assets/images/pexels-shvets-production-8900041.jpg');
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
        $this->get('/payment.html')
            ->assertOk()
            ->assertSee('Konfirmasi & Pembayaran', false)
            ->assertSee('/assets/images/pexels-shvets-production-8900041.jpg', false)
            ->assertDontSee('api/products.php');
    }
}
