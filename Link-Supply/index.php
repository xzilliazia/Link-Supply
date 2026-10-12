<?php
$catalogProducts = require __DIR__ . '/products-data.php';
$escape = static fn (string $value): string => htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$formatIDR = static fn (int $value): string => 'Rp ' . number_format($value, 0, ',', '.');
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Link Supply</title>
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    
    <link rel="stylesheet" href="css/tailwind.css">
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="font-sans text-text-main text-sm antialiased bg-fixed bg-cover bg-center bg-no-repeat min-h-screen" style="background-color: #ffffff;">

    <div id="pageLoader" class="page-loader" role="status" aria-live="polite">
        <span class="page-loader__spinner" aria-hidden="true"></span>
        <p>Unloading truck..</p>
    </div>

    <section id="pageTimeoutError" class="page-timeout" role="alertdialog" aria-modal="true" aria-labelledby="pageTimeoutTitle" aria-describedby="pageTimeoutMessage" hidden>
        <span class="material-symbols-outlined page-timeout__icon" aria-hidden="true">wifi_off</span>
        <h1 id="pageTimeoutTitle">Loading page failed</h1>
        <p id="pageTimeoutMessage">Check your internet connection then try again.</p>
        <button id="pageTimeoutRetry" class="bg-primary hover:bg-primary-dark text-white font-semibold py-2.5 px-5 rounded-lg transition-colors cursor-pointer" type="button">Reload</button>
    </section>
    <script>
        document.getElementById('pageTimeoutRetry')?.addEventListener('click', () => {
            const loader = document.getElementById('pageLoader');
            const loaderMessage = loader?.querySelector('p');
            const timeoutError = document.getElementById('pageTimeoutError');

            timeoutError?.setAttribute('hidden', '');
            loader?.classList.remove('is-hidden');
            loader?.setAttribute('aria-hidden', 'false');
            if (loaderMessage) loaderMessage.textContent = 'Unloading truck...';
            window.location.reload();
        });

        window.pageLoadTimeoutId = window.setTimeout(() => {
            if (typeof window.handlePageLoadTimeout === 'function') {
                window.handlePageLoadTimeout();
                return;
            }

            document.getElementById('pageLoader')?.classList.add('is-hidden');
            document.getElementById('pageTimeoutError')?.removeAttribute('hidden');
        }, 15000);
    </script>

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

    <div class="wrapper w-full max-w-[1400px] mx-auto min-h-screen relative pb-20">
        <main class="main-content p-3 sm:p-5 md:p-8">
            
            <div class="slider-container group relative w-full overflow-hidden rounded-xl mb-4 sm:mb-5 shadow-lg" id="adSlider">
                <div class="slider-wrapper flex w-full transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]" id="sliderWrapper">
                    
                    <section class="slide-banner min-w-full w-full shrink-0 relative flex flex-col items-center justify-center text-center text-white min-h-[200px] sm:min-h-[250px] md:min-h-[290px] py-8 sm:py-11 md:py-14 px-4 sm:px-8">
                        <img class="slide-banner__image" src="./Assets/pexels-shvets-production-8900041.jpg" alt="" fetchpriority="high" decoding="async">
                        <div class="ad-content max-w-2xl px-2">
                            <span class="ad-badge inline-block bg-bg-muted/95 text-primary-dark text-xs font-bold px-3.5 py-1 rounded-md mb-3 sm:mb-4 tracking-wider shadow-sm">PROMO TERBATAS</span>
                            <h1 class="ad-title text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 leading-tight text-white">Flash Sale Panen Raya! Diskon Hingga 50%</h1>
                            <p class="ad-desc text-xs sm:text-sm md:text-base text-white/90 mb-5 sm:mb-6 leading-relaxed">Dapatkan harga terbaik langsung dari petani untuk beras, jagung, dan sayuran segar hari ini.</p>
                            <button class="btn-ad bg-[#edf1d6] hover:bg-white text-[#155402] font-bold text-xs sm:text-sm md:text-base py-2.5 sm:py-3.5 px-5 sm:px-7 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer">Lihat Promo Sekarang</button>
                        </div>
                    </section>

                    <section class="slide-banner min-w-full w-full shrink-0 relative flex flex-col items-center justify-center text-center text-white min-h-[200px] sm:min-h-[250px] md:min-h-[290px] py-8 sm:py-11 md:py-14 px-4 sm:px-8">
                        <img class="slide-banner__image" data-src="./Assets/pexels-tima-miroshnichenko-6169177.jpg" alt="" decoding="async">
                        <div class="ad-content max-w-2xl px-2">
                            <span class="ad-badge inline-block bg-bg-muted/95 text-primary-dark text-xs font-bold px-3.5 py-1 rounded-md mb-3 sm:mb-4 tracking-wider shadow-sm">PENAWARAN KHUSUS</span>
                            <h1 class="ad-title text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 leading-tight text-white">Gratis Ongkir untuk Area Jawa Timur</h1>
                            <p class="ad-desc text-xs sm:text-sm md:text-base text-white/90 mb-5 sm:mb-6 leading-relaxed">Beli minimal 500kg dan nikmati pengiriman gratis langsung ke gudang atau pasar induk Anda.</p>
                            <button class="btn-ad bg-[#edf1d6] hover:bg-white text-[#155402] font-bold text-xs sm:text-sm md:text-base py-2.5 sm:py-3.5 px-5 sm:px-7 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer">Cek Area Pengiriman</button>
                        </div>
                    </section>
                    
                    <section class="slide-banner min-w-full w-full shrink-0 relative flex flex-col items-center justify-center text-center text-white min-h-[200px] sm:min-h-[250px] md:min-h-[290px] py-8 sm:py-11 md:py-14 px-4 sm:px-8">
                        <img class="slide-banner__image" data-src="./Assets/pexels-1135897-30199346.jpg" alt="" decoding="async">
                        <div class="ad-content max-w-2xl px-2">
                            <span class="ad-badge inline-block bg-bg-muted/95 text-primary-dark text-xs font-bold px-3.5 py-1 rounded-md mb-3 sm:mb-4 tracking-wider shadow-sm">MITRA BARU</span>
                            <h1 class="ad-title text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 leading-tight text-white">Koperasi Nelayan Pantura Resmi Bergabung</h1>
                            <p class="ad-desc text-xs sm:text-sm md:text-base text-white/90 mb-5 sm:mb-6 leading-relaxed">Pasokan ikan laut segar kini lebih terjamin dengan kapasitas hingga 10 ton per hari langsung dari dermaga.</p>
                            <button class="btn-ad bg-[#edf1d6] hover:bg-white text-[#155402] font-bold text-xs sm:text-sm md:text-base py-2.5 sm:py-3.5 px-5 sm:px-7 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer">Lihat Katalog Ikan</button>
                        </div>
                    </section>

                    <section class="slide-banner min-w-full w-full shrink-0 relative flex flex-col items-center justify-center text-center text-white min-h-[200px] sm:min-h-[250px] md:min-h-[290px] py-8 sm:py-11 md:py-14 px-4 sm:px-8">
                        <img class="slide-banner__image" data-src="./Assets/pexels-yuslava-36897781.jpg" alt="" decoding="async">
                        <div class="ad-content max-w-2xl px-2">
                            <span class="ad-badge inline-block bg-bg-muted/95 text-primary-dark text-xs font-bold px-3.5 py-1 rounded-md mb-3 sm:mb-4 tracking-wider shadow-sm">KUALITAS EKSPOR</span>
                            <h1 class="ad-title text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 leading-tight text-white">Suplai Buah & Sayuran Organik Grade A</h1>
                            <p class="ad-desc text-xs sm:text-sm md:text-base text-white/90 mb-5 sm:mb-6 leading-relaxed">Dipanen harian dari kebun mitra bersertifikasi GAP. Kualitas terjamin segar, higienis, dan siap kirim tepat waktu.</p>
                            <button class="btn-ad bg-[#edf1d6] hover:bg-white text-[#155402] font-bold text-xs sm:text-sm md:text-base py-2.5 sm:py-3.5 px-5 sm:px-7 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer">Pesan Pasokan Organik</button>
                        </div>
                    </section>

                    <section class="slide-banner min-w-full w-full shrink-0 relative flex flex-col items-center justify-center text-center text-white min-h-[200px] sm:min-h-[250px] md:min-h-[290px] py-8 sm:py-11 md:py-14 px-4 sm:px-8">
                        <img class="slide-banner__image" data-src="./Assets/pexels-nicolas-rueda-175965148-17546504.jpg" alt="" decoding="async">
                        <div class="ad-content max-w-2xl px-2">
                            <span class="ad-badge inline-block bg-bg-muted/95 text-primary-dark text-xs font-bold px-3.5 py-1 rounded-md mb-3 sm:mb-4 tracking-wider shadow-sm">SOLUSI LOGISTIK</span>
                            <h1 class="ad-title text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 leading-tight text-white">Jaga Kesegaran dengan Cold Storage Modern</h1>
                            <p class="ad-desc text-xs sm:text-sm md:text-base text-white/90 mb-5 sm:mb-6 leading-relaxed">Sewa ruang pendingin berkapasitas tinggi dan armada cold chain untuk menjaga mutu komoditas pertanian & perikanan Anda.</p>
                            <button class="btn-ad bg-[#edf1d6] hover:bg-white text-[#155402] font-bold text-xs sm:text-sm md:text-base py-2.5 sm:py-3.5 px-5 sm:px-7 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer">Konsultasi Cold Chain</button>
                        </div>
                    </section>

                </div>

                <button class="slider-btn slider-prev absolute top-1/2 -translate-y-1/2 left-2 sm:left-4 w-9 h-9 sm:w-11 sm:h-11 bg-white/90 hover:bg-black border border-white/40 rounded-full text-text-main hover:text-primary flex items-center justify-center shadow-lg transition-all duration-200 z-10 opacity-80 sm:opacity-0 sm:invisible group-hover:opacity-100 group-hover:visible hover:scale-105 active:scale-95 cursor-pointer" id="slidePrev" aria-label="Slide Sebelumnya">
                    <span class="material-symbols-outlined text-2xl">chevron_left</span>
                </button>
                <button class="slider-btn slider-next absolute top-1/2 -translate-y-1/2 right-2 sm:right-4 w-9 h-9 sm:w-11 sm:h-11 bg-white/90 hover:bg-black border border-white/40 rounded-full text-text-main hover:text-primary flex items-center justify-center shadow-lg transition-all duration-200 z-10 opacity-80 sm:opacity-0 sm:invisible group-hover:opacity-100 group-hover:visible hover:scale-105 active:scale-95 cursor-pointer" id="slideNext" aria-label="Slide Berikutnya">
                    <span class="material-symbols-outlined text-2xl">chevron_right</span>
                </button>

                <div class="slider-dots absolute bottom-2.5 sm:bottom-3.5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10 py-1 sm:py-1.5 px-3 bg-black/25 backdrop-blur-sm rounded-full" id="sliderDots"></div>
            </div>

            <div class="catalog-toolbar flex items-center gap-3 mb-4">
            <section class="category-pills flex flex-1 min-w-0 gap-1.5 sm:gap-2 overflow-x-auto py-1 scrollbar-none" aria-label="Filter kategori">
                <span class="py-2 text-xs text-gray-500" role="status">Memuat kategori...</span>
            </section>
                <div class="sort-box flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 shrink-0">
                    <span class="material-symbols-outlined text-lg sm:text-xl text-gray-500">sort</span>
                    <label for="sortProducts" class="hidden sm:inline font-medium">Urutkan:</label>
                    <select id="sortProducts" class="py-1.5 sm:py-2 pl-2.5 pr-8 border border-gray-300 rounded-lg bg-white text-gray-800 text-xs sm:text-sm cursor-pointer outline-none focus:border-primary-dark shadow-xs">
                        <option value="default">Rekomendasi</option>
                        <option value="price-low">Harga Terendah</option>
                        <option value="price-high">Harga Tertinggi</option>
                        <option value="name-az">Nama A - Z</option>
                        <option value="name-za">Nama Z - A</option>
                        <option value="rating-high">Rating Tertinggi</option>
                    </select>
                </div>
            </div>

            <div class="product-area">
                <div class="grid-container grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3 mb-5" id="productGrid">
                    <?php foreach ($catalogProducts as $index => $product): ?>
                        <a href="./product.php?id=<?= (int) $product['id'] ?>" class="product-card bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col shadow-xs card-fade-in<?= $index >= 24 ? ' hidden-by-see-all' : '' ?>" aria-label="Lihat detail <?= $escape($product['name']) ?>">
                            <div class="card-img-wrap relative aspect-square w-full overflow-hidden bg-gray-100 group/img">
                                <img src="<?= $escape($product['image']) ?>" alt="<?= $escape($product['name']) ?>" class="w-full h-full object-cover" loading="lazy">
                            </div>
                            <div class="card-body p-3 flex flex-col flex-1 gap-2">
                                <h4 class="product-title font-medium text-gray-800 text-xs sm:text-sm leading-snug line-clamp-2 hover:text-primary transition-colors" title="<?= $escape($product['name']) ?>">
                                    <?= $escape($product['name']) ?>
                                </h4>
                                <div class="card-meta flex justify-between items-center text-[11px] sm:text-xs text-text-muted">
                                    <span class="flex items-center gap-1">
                                        <span class="material-symbols-outlined text-sm" aria-hidden="true">location_on</span>
                                        <span class="truncate max-w-[120px]" title="<?= $escape($product['location']) ?>"><?= $escape(explode(',', $product['location'])[0]) ?></span>
                                    </span>
                                    <span class="flex items-center gap-0.5 text-amber-500 font-semibold">
                                        <span class="material-symbols-outlined text-sm text-amber-400" aria-hidden="true" style="font-variation-settings: 'FILL' 1;">star</span>
                                        <?= $escape((string) $product['rating']) ?>
                                    </span>
                                </div>
                                <div class="price-row mt-auto pt-1">
                                    <div class="text-primary-dark font-extrabold text-base sm:text-lg">
                                        <?= $formatIDR($product['price']) ?> <span class="text-[11px] text-gray-500 font-normal">/<?= $escape($product['priceUnit']) ?></span>
                                    </div>
                                </div>
                            </div>
                        </a>
                    <?php endforeach; ?>
                </div>

                <!-- See All Button -->
                <div class="see-all-container flex justify-center items-center mt-3.5 mb-9"<?= count($catalogProducts) <= 24 ? ' style="display:none"' : '' ?>>
                    <button class="btn-see-all inline-flex items-center gap-2 bg-white border-[1.5px] border-primary text-primary hover:bg-primary hover:text-white font-bold text-xs sm:text-sm py-2.5 px-6 rounded-md shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer" id="btnSeeAll">
                        <span>Lihat Semua Produk</span>
                        <span class="material-symbols-outlined text-lg transition-transform duration-300">expand_more</span>
                    </button>
                </div>
            </div>
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

    <!-- Link Interactive Application Script -->
    <script>
        window.LINKSUPPLY_PRODUCTS = <?= json_encode($catalogProducts, JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_THROW_ON_ERROR) ?>;
    </script>
    <script type="module" src="js/image-loading.js"></script>
    <script type="module" src="js/app.js"></script>
</body>
</html>