<?php
return static function (array $productView, \Closure $escape, \Closure $formatIDR, array $mockReviews): void {
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
        <section class="product-page__gallery" aria-label="Galeri produk">
            <div class="product-page__gallery-main">
                <?php foreach ($productView['gallery'] as $index => $imageLabel): ?>
                    <svg class="product-page__illustration<?= $index === 0 ? '' : ' hidden' ?>" data-gallery-image="<?= $index ?>" viewBox="0 0 560 480" role="img" aria-label="<?= $escape($productView['title'] . ', ilustrasi ' . $imageLabel) ?>" xmlns="http://www.w3.org/2000/svg">
                        <title><?= $escape($productView['title'] . ', ilustrasi ' . $imageLabel) ?></title>
                        <rect x="24" y="24" width="512" height="432" rx="28" fill="var(--bg-muted)"/>
                        <circle cx="<?= $index === 1 ? 172 : 390 ?>" cy="132" r="72" fill="var(--primary-light)" opacity=".28"/>
                        <path d="M96 344 190 206l68 88 55-70 151 120v42H96z" fill="var(--primary-light)" opacity=".42"/>
                        <path d="M156 280h248l-19 111H175z" rx="10" fill="var(--primary)"/>
                        <path d="M174 268h211v36H174z" fill="var(--primary-dark)"/>
                        <path d="M280 269c-29-25-18-58 4-78 4 31 23 41 13 67 23-22 45-19 61-13-27 10-33 28-50 42" fill="var(--bg-main)"/>
                        <path d="M280 271c1-31 7-53 20-72" fill="none" stroke="var(--bg-main)" stroke-width="7" stroke-linecap="round"/>
                        <circle cx="148" cy="144" r="8" fill="var(--primary)"/>
                        <circle cx="420" cy="172" r="6" fill="var(--primary)"/>
                        <path d="M210 340h140" stroke="var(--bg-main)" stroke-width="8" stroke-linecap="round" opacity=".75"/>
                    </svg>
                <?php endforeach; ?>
                <span class="product-page__gallery-caption">Ilustrasi produk</span>
            </div>
            <div class="product-page__thumbnails" role="group" aria-label="Pilih ilustrasi produk">
                <?php foreach ($productView['gallery'] as $index => $imageLabel): ?>
                    <button class="product-page__thumbnail<?= $index === 0 ? ' is-active' : '' ?>" type="button" data-gallery-index="<?= $index ?>" aria-label="Tampilkan <?= $escape($productView['title'] . ', ilustrasi ' . $imageLabel) ?>" aria-pressed="<?= $index === 0 ? 'true' : 'false' ?>">
                        <svg viewBox="0 0 560 480" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                            <rect x="24" y="24" width="512" height="432" rx="28" fill="var(--bg-muted)"/>
                            <circle cx="<?= $index === 1 ? 172 : 390 ?>" cy="132" r="72" fill="var(--primary-light)" opacity=".28"/>
                            <path d="M96 344 190 206l68 88 55-70 151 120v42H96z" fill="var(--primary-light)" opacity=".42"/>
                            <path d="M156 280h248l-19 111H175z" fill="var(--primary)"/>
                            <path d="M174 268h211v36H174z" fill="var(--primary-dark)"/>
                            <path d="M280 269c-29-25-18-58 4-78 4 31 23 41 13 67 23-22 45-19 61-13-27 10-33 28-50 42" fill="var(--bg-main)"/>
                            <path d="M280 271c1-31 7-53 20-72" fill="none" stroke="var(--bg-main)" stroke-width="7" stroke-linecap="round"/>
                            <circle cx="148" cy="144" r="8" fill="var(--primary)"/>
                            <circle cx="420" cy="172" r="6" fill="var(--primary)"/>
                            <path d="M210 340h140" stroke="var(--bg-main)" stroke-width="8" stroke-linecap="round" opacity=".75"/>
                        </svg>
                    </button>
                <?php endforeach; ?>
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
                <a href="#productReviews"><?= number_format($productView['rating']['count'], 0, ',', '.') ?> ulasan</a>
            </div>
            <div class="product-page__price-panel">
                <div class="product-page__price-line">
                    <p class="product-page__price"><?= $formatIDR($productView['pricing']['amount']) ?><span> / <?= $escape($productView['pricing']['unit']) ?></span></p>
                    <span class="product-page__discount"><?= $productView['pricing']['discountPercent'] ?>% OFF</span>
                </div>
                <p class="product-page__original-price"><?= $formatIDR($productView['pricing']['originalAmount']) ?> <span>harga pembanding contoh</span></p>
                <p class="product-page__preview-note">Harga dan variasi merupakan data pratinjau.</p>
            </div>
            <fieldset class="product-page__variant-selector">
                <legend>Pilihan pasokan <span>· Pilihan contoh</span></legend>
                <div class="product-page__variant-options">
                    <?php foreach ($productView['variants'] as $index => $variant): ?>
                        <button class="product-page__variant<?= $index === 0 ? ' is-selected' : '' ?>" type="button" data-variant-id="<?= $index ?>" aria-pressed="<?= $index === 0 ? 'true' : 'false' ?>">
                            <span><?= $escape($variant) ?></span><span class="material-symbols-outlined" aria-hidden="true"><?= $index === 0 ? 'check_circle' : 'radio_button_unchecked' ?></span>
                        </button>
                    <?php endforeach; ?>
                </div>
            </fieldset>
            <section class="product-page__details" aria-labelledby="productDetailsHeading">
                <h2 id="productDetailsHeading">Informasi pasokan</h2>
                <dl>
                    <div><dt>Kondisi</dt><dd><?= $escape($productView['specs']['condition']) ?></dd></div>
                    <div><dt>Bobot satuan</dt><dd><?= $escape($productView['specs']['unitWeight']) ?></dd></div>
                    <div><dt>Minimum pembelian</dt><dd><?= $escape($productView['inventory']['minimumLabel']) ?></dd></div>
                    <div><dt>Kategori</dt><dd><a href="./index.php#productGrid"><?= $escape($productView['specs']['category']) ?></a></dd></div>
                    <div><dt>Showcase</dt><dd><a href="./index.php#productGrid"><?= $escape($productView['specs']['showcase']) ?></a></dd></div>
                </dl>
                <p class="product-page__description is-clamped" data-product-description><?= $escape($productView['specs']['description']) ?></p>
                <button class="product-page__text-button" type="button" data-expand-description aria-expanded="false">Lihat selengkapnya</button>
            </section>
            <div class="product-page__seller">
                <div class="product-page__seller-avatar" aria-hidden="true"><span class="material-symbols-outlined">storefront</span></div>
                <div class="product-page__seller-copy">
                    <strong><?= $escape($productView['seller']['name']) ?></strong><span class="product-page__seller-caption">Profil pemasok contoh</span>
                    <?php if ($productView['seller']['verified']): ?><span class="product-page__verified"><span class="material-symbols-outlined" aria-label="Penjual terverifikasi">verified</span> Terverifikasi · contoh</span><?php endif; ?>
                </div>
                <button class="product-page__follow" type="button" data-follow-seller aria-pressed="false">Ikuti</button>
            </div>
        </section>

        <aside class="product-page__purchase-box" aria-label="Beli produk">
            <div class="product-page__purchase-heading"><span class="material-symbols-outlined" aria-hidden="true">inventory_2</span><h2>Pesan pasokan</h2></div>
            <div class="product-page__stock"><span>Stok tersedia</span><strong><?= number_format($productView['inventory']['stock'], 0, ',', '.') ?> <?= $escape($productView['pricing']['unit']) ?></strong></div>
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

    <section class="product-page__reviews" id="productReviews" aria-labelledby="reviewsHeading" aria-describedby="reviewsNotice">
        <div class="product-page__section-heading">
            <div><span class="product-page__section-kicker">Suara mitra</span><h2 id="reviewsHeading">Rating &amp; ulasan</h2></div>
            <p id="reviewsNotice">Contoh ulasan untuk pratinjau, bukan ulasan pelanggan terverifikasi.</p>
        </div>
        <div class="product-page__review-overview">
            <div class="product-page__review-score"><strong><?= number_format($productView['rating']['value'], 1, '.', '') ?></strong><span class="product-page__stars" role="img" aria-label="<?= $escape((string) $productView['rating']['value']) ?> dari 5 bintang"><?php for ($star = 1; $star <= 5; $star++): ?><span class="material-symbols-outlined" aria-hidden="true"><?= $star <= round($productView['rating']['value']) ? 'star' : 'star_outline' ?></span><?php endfor; ?></span><span><?= number_format($productView['rating']['count'], 0, ',', '.') ?> ulasan contoh</span></div>
            <div class="product-page__rating-bars">
                <?php foreach ([5, 4, 3, 2, 1] as $stars): $count = $productView['rating']['distribution'][$stars]; ?>
                    <div class="product-page__rating-row"><span><?= $stars ?> bintang</span><div role="img" aria-label="<?= $stars ?> bintang, <?= $count ?> ulasan"><span style="width:<?= $count / $productView['rating']['count'] * 100 ?>%"></span></div><span><?= $count ?></span></div>
                <?php endforeach; ?>
            </div>
        </div>
        <div class="product-page__review-list">
            <?php foreach ($mockReviews as $review): ?>
                <article class="product-page__review">
                    <div><strong><?= $escape($review['name']) ?></strong><span class="product-page__stars" role="img" aria-label="<?= $review['rating'] ?> dari 5 bintang"><?php for ($star = 1; $star <= 5; $star++): ?><span class="material-symbols-outlined" aria-hidden="true"><?= $star <= $review['rating'] ? 'star' : 'star_outline' ?></span><?php endfor; ?></span></div>
                    <time><?= $escape($review['date']) ?></time><p><?= $escape($review['comment']) ?></p>
                </article>
            <?php endforeach; ?>
        </div>
    </section>

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
};
