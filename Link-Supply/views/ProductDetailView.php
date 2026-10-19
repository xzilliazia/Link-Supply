<?php

final class ProductDetailView
{
    public function render(array $productView): void
    {
        $escape = ViewHelper::escape(...);
        $formatIDR = ViewHelper::formatIDR(...);
        ?>
<div id="productDetail" class="product-page__container product-page__content" aria-live="polite">
    <nav class="product-page__breadcrumb" aria-label="Breadcrumb">
        <a href="./index.php">Beranda</a>
        <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
        <a href="./index.php#productGrid"><?= $escape($productView['specs']['category']) ?></a>
        <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
        <span aria-current="page"><?= $escape($productView['title']) ?></span>
    </nav>
    <div class="product-page__layout">
        <section class="product-page__gallery" aria-label="Foto produk">
            <div class="product-page__gallery-main">
                <img class="product-page__gallery-image" src="<?= $escape($productView['image']) ?>" alt="<?= $escape($productView['title']) ?>" fetchpriority="high" decoding="async">
            </div>
        </section>

        <section class="product-page__summary" aria-label="Ringkasan produk">
            <div class="product-page__eyebrow">
                <span><?= $escape($productView['specs']['category']) ?></span>
                <span class="product-page__availability<?= $productView['inventory']['available'] ? '' : ' is-unavailable' ?>"><i></i><?= $escape($productView['inventory']['status']) ?></span>
            </div>
            <div class="product-page__title-row">
                <h1 id="productTitle" class="product-page__title is-clamped"><?= $escape($productView['title']) ?></h1>
                <button class="product-page__icon-button" type="button" data-expand-title aria-label="Tampilkan nama produk selengkapnya" aria-expanded="false"><span class="material-symbols-outlined" aria-hidden="true">expand_more</span></button>
            </div>
            <div class="product-page__meta">
                <span>Terjual <?= $escape($productView['sales']['sold']) ?></span><span class="product-page__meta-separator" aria-hidden="true">·</span>
                <span class="product-page__rating"><span class="product-page__stars" role="img" aria-label="<?= $escape((string) $productView['rating']['value']) ?> dari 5 bintang"><?php for ($star = 1; $star <= 5; $star++): ?><span class="material-symbols-outlined" aria-hidden="true"><?= $star <= round($productView['rating']['value']) ? 'star' : 'star_outline' ?></span><?php endfor; ?></span> <strong><?= $escape((string) $productView['rating']['value']) ?></strong></span>
            </div>
            <div class="product-page__price-panel">
                <div class="product-page__price-line">
                    <p class="product-page__price"><?= $formatIDR($productView['pricing']['amount']) ?><span> / <?= $escape($productView['pricing']['unit']) ?></span></p>
                </div>
            </div>
            <section class="product-page__details" aria-labelledby="productDetailsHeading">
                <h2 id="productDetailsHeading">Informasi pasokan</h2>
                <dl>
                    <div><dt>Harga satuan</dt><dd><?= $formatIDR($productView['pricing']['amount']) ?> / <?= $escape($productView['pricing']['unit']) ?></dd></div>
                    <div><dt>Minimum pembelian</dt><dd><?= $escape($productView['inventory']['minimumLabel']) ?></dd></div>
                    <div><dt>Kategori</dt><dd><a href="./index.php#productGrid"><?= $escape($productView['specs']['category']) ?></a></dd></div>
                    <div><dt>Lokasi pemasok</dt><dd><?= $escape($productView['specs']['location']) ?></dd></div>
                </dl>
                <p class="product-page__description is-clamped" data-product-description><?= $escape($productView['specs']['description']) ?></p>
                <button class="product-page__text-button" type="button" data-expand-description aria-expanded="false">Lihat selengkapnya</button>
            </section>
            <div class="product-page__seller">
                <div class="product-page__seller-avatar" aria-hidden="true"><span class="material-symbols-outlined">storefront</span></div>
                <div class="product-page__seller-copy">
                    <strong>Asal pasokan</strong><span class="product-page__seller-caption"><?= $escape($productView['specs']['province']) ?></span>
                </div>
            </div>
        </section>

        <aside class="product-page__purchase-box" aria-label="Beli produk">
            <div class="product-page__purchase-heading"><span class="material-symbols-outlined" aria-hidden="true">inventory_2</span><h2>Pesan pasokan</h2></div>
            <div class="product-page__stock"><span>Stok tersedia</span><strong><?= number_format($productView['inventory']['stock'], 0, ',', '.') ?> <?= $escape($productView['inventory']['unit']) ?></strong></div>
            <?php if (!$productView['inventory']['available']): ?><p class="product-page__out-of-stock" role="status"><?= $escape($productView['inventory']['message']) ?></p><?php endif; ?>
            <div class="product-page__purchase-quantity">
                <span>Jumlah pesanan</span>
                <div class="product-page__stepper" role="group" aria-label="Jumlah pesanan">
                    <button type="button" data-quantity-step="-1" aria-label="Kurangi jumlah">−</button>
                    <input type="number" data-quantity-input min="<?= $productView['inventory']['minimum'] ?>" max="<?= $productView['inventory']['stock'] ?>" step="1" value="<?= $productView['inventory']['minimum'] ?>" inputmode="numeric" aria-label="Jumlah <?= $escape($productView['specs']['unitWeight']) ?>">
                    <button type="button" data-quantity-step="1" aria-label="Tambah jumlah">+</button>
                </div>
            </div>
            <p class="product-page__minimum">Minimum <?= $escape($productView['inventory']['minimumLabel']) ?></p>
            <div class="product-page__subtotal"><span>Subtotal</span><strong data-subtotal><?= $formatIDR($productView['pricing']['amount'] * $productView['inventory']['minimum']) ?></strong></div>
            <button class="product-page__button" type="button" data-add-to-cart><span class="material-symbols-outlined" aria-hidden="true">add_shopping_cart</span>Tambah ke Keranjang</button>
            <button class="product-page__button product-page__button--secondary" type="button" data-buy-now>Beli Sekarang</button>
            <div class="product-page__trust">
                <span><span class="material-symbols-outlined" aria-hidden="true">local_shipping</span>Detail pengiriman tersedia saat checkout</span>
                <span><span class="material-symbols-outlined" aria-hidden="true">lock</span>Metode pembayaran tersedia saat checkout</span>
            </div>
            <div class="product-page__secondary-actions">
                <button type="button" data-product-action="chat"><span class="material-symbols-outlined" aria-hidden="true">chat</span><span>Chat</span></button>
                <button type="button" data-product-action="wishlist" aria-pressed="false"><span class="material-symbols-outlined" aria-hidden="true">favorite_border</span><span>Wishlist</span></button>
                <button type="button" data-product-action="share"><span class="material-symbols-outlined" aria-hidden="true">share</span><span>Bagikan</span></button>
            </div>
        </aside>
    </div>

    <div class="product-page__mobile-bar" role="region" aria-label="Aksi pembelian cepat">
        <div class="product-page__mobile-bar-info">
            <div class="product-page__stepper" role="group" aria-label="Jumlah pesanan">
                <button type="button" data-quantity-step="-1" aria-label="Kurangi jumlah">−</button>
                <input type="number" data-quantity-input min="<?= $productView['inventory']['minimum'] ?>" max="<?= $productView['inventory']['stock'] ?>" step="1" value="<?= $productView['inventory']['minimum'] ?>" inputmode="numeric" aria-label="Jumlah <?= $escape($productView['specs']['unitWeight']) ?>">
                <button type="button" data-quantity-step="1" aria-label="Tambah jumlah">+</button>
            </div>
            <div><span>Subtotal</span><strong data-subtotal><?= $formatIDR($productView['pricing']['amount'] * $productView['inventory']['minimum']) ?></strong></div>
        </div>
        <div class="product-page__mobile-bar-actions">
            <button class="product-page__button product-page__button--secondary" type="button" data-buy-now>Beli</button>
            <button class="product-page__button" type="button" data-add-to-cart aria-label="Tambah ke keranjang"><span class="material-symbols-outlined" aria-hidden="true">add_shopping_cart</span></button>
        </div>
    </div>
</div>
<?php
    }
}
