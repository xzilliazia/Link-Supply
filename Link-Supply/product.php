<?php
$products = require __DIR__ . '/products-data.php';
$requestedProductId = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
$product = null;

if (is_int($requestedProductId)) {
    foreach ($products as $item) {
        if ($item['id'] === $requestedProductId) {
            $product = $item;
            break;
        }
    }
}

if ($product === null) {
    http_response_code(404);
}

$pageTitle = $product['name'] ?? 'Produk tidak ditemukan';
$escape = static fn (string $value): string => htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$formatIDR = static fn (int $value): string => 'Rp ' . number_format($value, 0, ',', '.');

if ($product !== null) {
    $originalPrice = (int) (ceil(($product['price'] / 0.85) / 500) * 500);
    $ratingDistribution = $product['rating'] < 4.75
        ? [5 => 98, 4 => 22, 3 => 6, 2 => 1, 1 => 1]
        : ($product['rating'] < 4.85
            ? [5 => 110, 4 => 15, 3 => 2, 2 => 1, 1 => 0]
            : [5 => 120, 4 => 6, 3 => 1, 2 => 1, 1 => 0]);
    $available = $product['stock'] > 0;
    $productView = [
        'id' => $product['id'],
        'title' => $product['name'],
        'pricing' => [
            'amount' => $product['price'],
            'unit' => $product['priceUnit'],
            'originalAmount' => $originalPrice,
            'discountPercent' => max(1, (int) round((1 - $product['price'] / $originalPrice) * 100)),
        ],
        'sales' => ['sold' => $product['soldCount']],
        'rating' => [
            'value' => $product['rating'],
            'count' => 128,
            'distribution' => $ratingDistribution,
        ],
        'inventory' => [
            'stock' => $product['stock'],
            'minimum' => $product['minOrder'],
            'minimumLabel' => number_format($product['minOrder'], 0, ',', '.') . ' ' . $product['minOrderUnit'],
            'available' => $available,
            'status' => $available ? 'Siap dipasok' : 'Stok habis',
            'message' => $available ? '' : 'Pasokan ini sedang habis. Silakan cek kembali nanti.',
        ],
        'specs' => [
            'condition' => $available ? 'Tersedia' : 'Stok habis',
            'unitWeight' => '1 ' . $product['priceUnit'],
            'category' => $product['categoryLabel'],
            'showcase' => $product['province'] ?: $product['location'],
            'description' => $product['desc'],
        ],
        'seller' => ['name' => 'Pemasok Pilihan', 'verified' => true],
        'gallery' => ['pasokan', 'kualitas', 'kemasan'],
        'variants' => ['Standar', 'Pilihan grosir'],
    ];
    $mockReviews = [
        ['name' => 'Rina Puspitasari', 'rating' => 5, 'date' => '12 Juni 2025', 'comment' => 'Kualitas produk sesuai deskripsi, jumlah pas, dan pengiriman tertata rapi.'],
        ['name' => 'Budi Santoso', 'rating' => 5, 'date' => '28 Mei 2025', 'comment' => 'Pasokan datang tepat waktu. Respons penjual cepat saat memastikan jadwal pengiriman.'],
        ['name' => 'Dewi Anggraini', 'rating' => 4, 'date' => '10 Mei 2025', 'comment' => 'Kualitasnya baik dan konsisten untuk kebutuhan usaha. Akan memesan kembali.'],
    ];
}
?>
<!DOCTYPE html>
<html lang="id" class="product-detail-page">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($pageTitle, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') ?> | LinkSupply</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="css/tailwind.css">
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="product-detail-page font-sans text-text-main text-sm antialiased bg-fixed bg-cover bg-center bg-no-repeat min-h-screen" style="background-color: var(--bg-main);">
    <!-- Navbar Begin -->
    <header class="navbar sticky top-0 z-50 w-full bg-white border-b border-gray-200 px-4 sm:px-6 md:px-8 py-2.5 flex flex-wrap md:flex-nowrap items-center justify-between gap-3 shadow-sm">
        <div class="logo-area flex items-center gap-1 shrink-0 order-1">
            <span class="material-symbols-outlined text-primary text-3xl sm:text-4xl select-none">eco</span>
            <div class="brand text-xl sm:text-2xl font-extrabold flex items-center tracking-tight">
                <span class="brand-link text-primary">Link</span><span class="brand-supply text-[#1c1c1c]">Supply.</span>
            </div>
        </div>
        
        <div class="search-bar flex items-center flex-1 w-full md:w-auto md:max-w-[800px] order-3 md:order-2 my-1 md:my-0 md:mx-4 border border-primary-dark rounded-lg p-0.5 pl-2.5 bg-white shadow-inner focus-within:ring-2 focus-within:ring-primary/20">
            <span class="material-symbols-outlined text-text-muted text-xl select-none">search</span>
            <input type="text" placeholder="Cari produk, kategori, atau merek" class="flex-1 border-none bg-transparent py-2 px-2.5 outline-none font-sans text-text-main text-xs sm:text-sm">
            <button class="btn-cari bg-primary text-white font-medium text-xs sm:text-sm py-2 px-3.5 sm:px-5 rounded-md hover:bg-primary-dark transition-colors duration-200 cursor-pointer shrink-0">Cari</button>
        </div>

        <div class="nav-actions flex items-center gap-3 sm:gap-5 order-2 md:order-3 shrink-0">
            <div class="location hidden md:flex items-center gap-1 text-text-muted text-xs border-r border-border-custom pr-4 lg:pr-6 select-none">
                <span class="material-symbols-outlined text-lg">location_on</span>
                <span>Lokasi</span>
            </div>
            <div class="icon-group flex items-center gap-3 sm:gap-4 text-primary border-r-0 md:border-r border-gray-200 md:pr-4 lg:pr-6">
                <span class="material-symbols-outlined icon-btn cursor-pointer text-xl sm:text-2xl hover:opacity-80 transition-opacity select-none">notifications</span>
                <span class="material-symbols-outlined icon-btn cursor-pointer text-xl sm:text-2xl hover:opacity-80 transition-opacity select-none">shopping_cart</span>
            </div>
            <div class="user-profile flex items-center gap-2 text-primary cursor-pointer select-none hover:opacity-90 transition-opacity" id="userProfileBtn">
                <div class="w-8 h-8 rounded-full bg-emerald-100 text-primary-dark flex items-center justify-center font-bold text-xs border border-border-custom shadow-xs">
                    LS
                </div>
                <div class="user-text hidden sm:flex flex-col">
                    <span class="text-xs font-bold text-gray-800 leading-tight">Mitra Tani Sejahtera</span>
                    <span class="text-[10px] text-text-muted leading-tight">Supplier Terverifikasi</span>
                </div>
            </div>
        </div>
    </header>
    <!-- Navbar End -->

    <div class="product-page-shell">
        <main class="product-page-main">
            <?php if ($product !== null): ?>
                <?php
                $renderProductDetail = require __DIR__ . '/product-detail-view.php';
                $renderProductDetail($productView, $escape, $formatIDR, $mockReviews);
                ?>
            <?php else: ?>
                <div class="product-page__container product-page__content product-page__error-state">
                    <div class="product-page__message" role="alert">
                        <span class="material-symbols-outlined" aria-hidden="true">cloud_off</span>
                        <h1>Produk tidak dapat dimuat</h1>
                        <p>Produk yang Anda cari tidak ditemukan.</p>
                        <a class="product-page__button" href="./index.php">Kembali ke katalog</a>
                    </div>
                </div>
            <?php endif; ?>
        </main>
    </div>
    <!-- Main Wrapper End -->

    <!-- Footer Section Begin -->
    <footer class="footer bg-[#f3f6fa] pt-12 sm:pt-16 pb-0 border-t border-[#e1e7ec] w-full">
        <div class="footer-container w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
            <div class="footer-row flex flex-col md:flex-row flex-wrap justify-between gap-8 mb-10">
                <!-- Col 1: About -->
                <div class="footer-col footer-col-about flex-1 min-w-[260px] max-w-sm">
                    <div class="footer__about">
                        <div class="footer__about__logo mb-4">
                            <a href="./index.php" class="brand inline-flex items-center text-2xl font-extrabold tracking-tight">
                                <span class="brand-link text-primary">Link</span><span class="brand-supply text-[#1c1c1c]">Supply</span>
                            </a>
                        </div>
                        <ul class="space-y-2 text-sm text-[#1c1c1c]">
                            <li>Alamat: Jl. Gatau No. 69, Rembang</li>
                            <li>Telepon: +62 21 555 1234</li>
                            <li>Email: support@linksupply.id</li>
                        </ul>
                    </div>
                </div>

                <!-- Col 2: Useful Links -->
                <div class="footer-col footer-col-links flex-1 min-w-[280px] max-w-md">
                    <div class="footer__widget">
                        <h6 class="text-base font-bold text-[#1c1c1c] mb-4">Tautan Berguna</h6>
                        <div class="footer__widget__links grid grid-cols-2 gap-4">
                            <ul class="space-y-2 text-sm">
                                <li><a href="#" class="text-[#1c1c1c] hover:text-primary hover:translate-x-1 inline-block transition-all duration-150">Tentang Kami</a></li>
                                <li><a href="#" class="text-[#1c1c1c] hover:text-primary hover:translate-x-1 inline-block transition-all duration-150">Tentang Toko Kami</a></li>
                                <li><a href="#" class="text-[#1c1c1c] hover:text-primary hover:translate-x-1 inline-block transition-all duration-150">Belanja Aman</a></li>
                                <li><a href="#" class="text-[#1c1c1c] hover:text-primary hover:translate-x-1 inline-block transition-all duration-150">Informasi Pengiriman</a></li>
                                <li><a href="#" class="text-[#1c1c1c] hover:text-primary hover:translate-x-1 inline-block transition-all duration-150">Kebijakan Privasi</a></li>
                                <li><a href="#" class="text-[#1c1c1c] hover:text-primary hover:translate-x-1 inline-block transition-all duration-150">Peta Situs</a></li>
                            </ul>
                            <ul class="space-y-2 text-sm">
                                <li><a href="#" class="text-[#1c1c1c] hover:text-primary hover:translate-x-1 inline-block transition-all duration-150">Siapa Kami</a></li>
                                <li><a href="#" class="text-[#1c1c1c] hover:text-primary hover:translate-x-1 inline-block transition-all duration-150">Layanan Kami</a></li>
                                <li><a href="#" class="text-[#1c1c1c] hover:text-primary hover:translate-x-1 inline-block transition-all duration-150">Proyek</a></li>
                                <li><a href="#" class="text-[#1c1c1c] hover:text-primary hover:translate-x-1 inline-block transition-all duration-150">Kontak</a></li>
                                <li><a href="#" class="text-[#1c1c1c] hover:text-primary hover:translate-x-1 inline-block transition-all duration-150">Inovasi</a></li>
                                <li><a href="#" class="text-[#1c1c1c] hover:text-primary hover:translate-x-1 inline-block transition-all duration-150">Testimoni</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Col 3: Newsletter & Social -->
                <div class="footer-col footer-col-newsletter flex-1 min-w-[260px] max-w-sm">
                    <div class="footer__widget">
                        <h6 class="text-base font-bold text-[#1c1c1c] mb-4">Berlangganan Newsletter Kami</h6>
                        <p class="text-sm text-[#1c1c1c] mb-5 leading-relaxed">Dapatkan info terbaru tentang produk dan penawaran spesial via email.</p>
                        <form action="#" class="footer__newsletter__form flex mb-6 w-full" onsubmit="event.preventDefault();">
                            <input type="email" placeholder="Masukkan email Anda" required class="w-full text-sm px-4 py-3 text-[#1c1c1c] h-11 border border-[#e1e7ec] rounded-l outline-none bg-white focus:border-primary">
                            <button type="submit" class="site-btn btn-subscribe bg-primary hover:bg-primary-dark text-white font-bold text-xs tracking-wider px-5 rounded-r cursor-pointer whitespace-nowrap transition-colors">LANGGANAN</button>
                        </form>
                        <div class="footer__widget__social flex items-center gap-3">
                            <a href="#" aria-label="Facebook" class="w-10 h-10 inline-flex items-center justify-center text-[#404040] hover:text-white border border-[#e1e7ec] rounded-full bg-white hover:bg-primary hover:border-primary hover:-translate-y-0.5 transition-all shadow-xs"><i class="fa fa-facebook"></i></a>
                            <a href="#" aria-label="Instagram" class="w-10 h-10 inline-flex items-center justify-center text-[#404040] hover:text-white border border-[#e1e7ec] rounded-full bg-white hover:bg-primary hover:border-primary hover:-translate-y-0.5 transition-all shadow-xs"><i class="fa fa-instagram"></i></a>
                            <a href="#" aria-label="Twitter" class="w-10 h-10 inline-flex items-center justify-center text-[#404040] hover:text-white border border-[#e1e7ec] rounded-full bg-white hover:bg-primary hover:border-primary hover:-translate-y-0.5 transition-all shadow-xs"><i class="fa fa-twitter"></i></a>
                            <a href="#" aria-label="Pinterest" class="w-10 h-10 inline-flex items-center justify-center text-[#404040] hover:text-white border border-[#e1e7ec] rounded-full bg-white hover:bg-primary hover:border-primary hover:-translate-y-0.5 transition-all shadow-xs"><i class="fa fa-pinterest"></i></a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer Bottom -->
            <div class="footer__bottom border-t border-[#e5eaef] py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div class="footer__copyright__text text-sm text-[#1c1c1c]">
                    <p>Copyright &copy;2026 Hak Cipta Dilindungi</p>
                </div>
                <div class="footer__copyright__payment flex items-center gap-3.5 flex-wrap">
                    <span class="pay-badge inline-flex items-center justify-center">
                        <img src="Assets/gopay-seeklogo.png" alt="GoPay" class="h-7 w-auto max-w-[75px] object-contain">
                    </span>
                    <span class="pay-badge inline-flex items-center justify-center">
                        <img src="Assets/shopeepay.png" alt="ShopeePay" class="h-7 w-auto max-w-[75px] object-contain">
                    </span>
                    <span class="pay-badge inline-flex items-center justify-center">
                        <img src="Assets/alfamart-seeklogo.png" alt="Alfamart" class="h-7 w-auto max-w-[75px] object-contain">
                    </span>
                </div>
            </div>
        </div>
    </footer>
    <!-- Footer Section End -->

    <?php if ($product !== null): ?>
        <script>
            window.LINKSUPPLY_PRODUCT = <?= json_encode($product, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_THROW_ON_ERROR) ?>;
        </script>
    <?php endif; ?>
    <script type="module" src="js/image-loading.js"></script>
    <script type="module" src="js/app.js"></script>
    <script type="module" src="js/product-page.js"></script>
</body>
</html>
