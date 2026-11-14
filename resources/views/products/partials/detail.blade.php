<div id="productDetail" class="product-page__container product-page__content" aria-live="polite">
    <nav class="product-page__breadcrumb" aria-label="Breadcrumb">
        <a href="/">Beranda</a>
        <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
        <a href="/#productGrid">{{ $product->category->name }}</a>
        <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
        <span aria-current="page">{{ $product->name }}</span>
    </nav>
    <div class="product-page__layout">
        <section class="product-page__gallery" aria-label="Foto produk">
            <div class="product-page__gallery-main">
                <img class="product-page__gallery-image" src="{{ str_starts_with($product->image, 'http') ? $product->image : asset($product->image) }}" alt="{{ $product->name }}" fetchpriority="high" decoding="async">
            </div>
        </section>

        <section class="product-page__summary" aria-label="Ringkasan produk">
            <div class="product-page__eyebrow">
                <span>{{ $product->category->name }}</span>
                <span class="product-page__availability{{ $product->stock > 0 ? '' : ' is-unavailable' }}"><i></i>{{ $product->stock > 0 ? 'Siap dipasok' : 'Stok habis' }}</span>
            </div>
            <div class="product-page__title-row">
                <h1 id="productTitle" class="product-page__title is-clamped">{{ $product->name }}</h1>
                <button class="product-page__icon-button" type="button" data-expand-title aria-label="Tampilkan nama produk selengkapnya" aria-expanded="false"><span class="material-symbols-outlined" aria-hidden="true">expand_more</span></button>
            </div>
            <div class="product-page__meta">
                <span>Terjual {{ $product->sold_count }}</span><span class="product-page__meta-separator" aria-hidden="true">·</span>
                <span class="product-page__rating"><span class="product-page__stars" role="img" aria-label="{{ $product->rating }} dari 5 bintang">@for ($star = 1; $star <= 5; $star++)<span class="material-symbols-outlined" aria-hidden="true">{{ $star <= round($product->rating) ? 'star' : 'star_outline' }}</span>@endfor</span> <strong>{{ $product->rating }}</strong></span>
            </div>
            <div class="product-page__price-panel">
                <div class="product-page__price-line">
                    <p class="product-page__price">Rp {{ number_format($product->price, 0, ',', '.') }}<span> / {{ $product->price_unit }}</span></p>
                </div>
            </div>
            <section class="product-page__details" aria-labelledby="productDetailsHeading">
                <h2 id="productDetailsHeading">Informasi pasokan</h2>
                <dl>
                    <div><dt>Harga satuan</dt><dd>Rp {{ number_format($product->price, 0, ',', '.') }} / {{ $product->price_unit }}</dd></div>
                    <div><dt>Minimum pembelian</dt><dd>{{ number_format($product->min_order, 0, ',', '.') }} {{ $product->min_order_unit }}</dd></div>
                    <div><dt>Kategori</dt><dd><a href="/#productGrid">{{ $product->category->name }}</a></dd></div>
                    <div><dt>Lokasi pemasok</dt><dd>{{ $product->location }}</dd></div>
                </dl>
                <p class="product-page__description is-clamped" data-product-description>{{ $product->description }}</p>
                <button class="product-page__text-button" type="button" data-expand-description aria-expanded="false">Lihat selengkapnya</button>
            </section>
            <div class="product-page__seller">
                <div class="product-page__seller-avatar" aria-hidden="true"><span class="material-symbols-outlined">storefront</span></div>
                <div class="product-page__seller-copy">
                    <strong>Asal pasokan</strong><span class="product-page__seller-caption">{{ $product->province }}</span>
                </div>
            </div>
        </section>

        <aside class="product-page__purchase-box" aria-label="Beli produk">
            <div class="product-page__purchase-heading"><span class="material-symbols-outlined" aria-hidden="true">inventory_2</span><h2>Pesan pasokan</h2></div>
            <div class="product-page__stock"><span>Stok tersedia</span><strong>{{ number_format($product->stock, 0, ',', '.') }} {{ $product->stock_unit }}</strong></div>
            @if ($product->stock <= 0)
                <p class="product-page__out-of-stock" role="status">Pasokan ini sedang habis. Silakan cek kembali nanti.</p>
            @endif
            <div class="product-page__purchase-quantity">
                <span>Jumlah pesanan</span>
                <div class="product-page__stepper" role="group" aria-label="Jumlah pesanan">
                    <button type="button" data-quantity-step="-1" aria-label="Kurangi jumlah">−</button>
                    <input type="number" data-quantity-input min="{{ $product->min_order }}" max="{{ $product->stock }}" step="1" value="{{ $product->min_order }}" inputmode="numeric" aria-label="Jumlah 1 {{ $product->price_unit }}">
                    <button type="button" data-quantity-step="1" aria-label="Tambah jumlah">+</button>
                </div>
            </div>
            <p class="product-page__minimum">Minimum {{ number_format($product->min_order, 0, ',', '.') }} {{ $product->min_order_unit }}</p>
            <div class="product-page__subtotal"><span>Subtotal</span><strong data-subtotal>Rp {{ number_format($product->price * $product->min_order, 0, ',', '.') }}</strong></div>
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
                <input type="number" data-quantity-input min="{{ $product->min_order }}" max="{{ $product->stock }}" step="1" value="{{ $product->min_order }}" inputmode="numeric" aria-label="Jumlah 1 {{ $product->price_unit }}">
                <button type="button" data-quantity-step="1" aria-label="Tambah jumlah">+</button>
            </div>
            <div><span>Subtotal</span><strong data-subtotal>Rp {{ number_format($product->price * $product->min_order, 0, ',', '.') }}</strong></div>
        </div>
        <div class="product-page__mobile-bar-actions">
            <button class="product-page__button product-page__button--secondary" type="button" data-buy-now>Beli</button>
            <button class="product-page__button" type="button" data-add-to-cart aria-label="Tambah ke keranjang"><span class="material-symbols-outlined" aria-hidden="true">add_shopping_cart</span></button>
        </div>
    </div>
</div>
