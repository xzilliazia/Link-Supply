# 🌾 LinkSupply - B2B Agricultural & Supply Chain Platform

LinkSupply adalah platform web rantai pasok dan pasar komoditas agribisnis (pertanian, perikanan, bahan makanan, perkebunan) yang menghubungkan petani, nelayan, koperasi, penyuplai, dan pembeli bisnis secara efisien dan transparan.

---

## 🚀 Fitur Interaktif UI/UX Terkini
- **Layar Loading Halaman**: Menampilkan indikator saat resource halaman dan data awal katalog/kategori sedang dimuat, lalu memberikan opsi coba lagi jika request data melebihi batas waktu 15 detik.
- **Skeleton Gambar**: Gambar produk, banner, keranjang, dan pembayaran menampilkan shimmer sampai selesai dimuat; gambar gagal berhenti beranimasi.
- **Katalog Produk Dinamis**: 24 komoditas pertanian & perikanan lengkap dengan harga grosir, minimal pesanan, stok riil, dan rating.
- **Pencarian Produk**: Cari berdasarkan nama, kategori, lokasi, atau deskripsi saat menekan Enter atau tombol Cari.
- **Filter Multi-Kategori**: Tombol kategori dinamis (Semua, Perikanan, Pertanian, Bahan Makanan, Perkebunan).
- **Pengurutan (Sorting Engine)**: Urutkan berdasarkan Rekomendasi, Harga Terendah/Tertinggi, Nama A-Z / Z-A, dan Rating.
- **Halaman Detail & Pemesanan Produk**: Layout galeri, informasi produk, dan kartu pembelian responsif dengan breadcrumb, spesifikasi, rating, dan ulasan contoh; sesuaikan jumlah, tambahkan ke keranjang, atau langsung ke pembayaran.
- **Keranjang Belanja Interaktif (Cart Drawer)**: Panel samping *offcanvas* dengan kontrol kuantitas, subtotal, badge animasi, dan penyimpanan lokal (*LocalStorage*).
- **Pusat Notifikasi**: Dropdown panel notifikasi dengan penanda status unread.
- **Filter Wilayah Pemasok**: Dropdown pilihan provinsi/kota asal penyuplai.
- **Sistem Notifikasi Mengambang (Floating Toast)**: Umpan balik visual instan untuk setiap interaksi pengguna.
- **Slider Banner Hero Responsif**: Auto-slide 5s, touch swipe mobile gesture, navigasi dots, pause on hover, dan pemuatan gambar sesuai slide agar koneksi lambat tidak memblokir banner.
- **Tombol Melayang Kembali ke Atas (Back-to-Top)**: Smooth scroll ke bagian atas halaman.
- **Validasi Newsletter**: Umpan balik interaktif saat mendaftarkan email berlangganan.

### Struktur Aplikasi (MVC dan OOP)
- **Model** (`Link-Supply/models/Product.php`) mewakili produk dan menyimpan seluruh 17 propertinya sebagai `private readonly`, dengan getter publik untuk akses. `Link-Supply/models/ProductCatalog.php` memuat data dari `Link-Supply/data/products.json`, lalu mengelola kumpulan object `Product`.
- **Controller** (`Link-Supply/controllers/CatalogController.php`, `Link-Supply/controllers/ProductController.php`, `Link-Supply/controllers/ProductsApiController.php`) menangani request, berinteraksi dengan Model, lalu meneruskan hasil ke View atau API.
- **View** (`Link-Supply/views/catalog.php`, `Link-Supply/views/product.php`, `Link-Supply/views/ProductDetailView.php`) merender HTML dari object dan data tampilan yang disiapkan Controller. `Link-Supply/views/ViewHelper.php` menangani escaping dan format harga.
- `Link-Supply/index.php`, `Link-Supply/product.php`, dan `Link-Supply/api/products.php` menjadi entry point tipis yang meneruskan request ke Controller. Alur katalog: request → Controller → Model → View.
- Array yang dipakai pada JSON API dan detail tampilan adalah format keluaran untuk kompatibilitas/presentasi; data produk aplikasi dikelola sebagai object `Product`. Loop dan kondisi pada template hanya mengatur pengulangan elemen HTML.
- JavaScript tetap menangani filter, pengurutan, keranjang, dan interaksi browser; CSS serta URL aset tidak berubah meskipun template PHP berada dalam folder View.

---

## 📖 Dokumentasi Lengkap
Dokumentasi fitur dan struktur proyek dapat dibaca di:
👉 [Link-Supply/docs/FEATURES.md](Link-Supply/docs/FEATURES.md)

---

## 💻 Cara Menjalankan
Siapkan CSS Tailwind lokal dan jalankan web melalui server:

```sh
npm install
npm run build:css
```

Jalankan situs melalui PHP 8.1+ dari direktori proyek:

```sh
php -S localhost:8000 -t Link-Supply
```

Buka `http://localhost:8000/index.php`. Server PHP diperlukan untuk SSR katalog/detail produk dan endpoint data katalog. Saat mengembangkan CSS, gunakan `npm run watch:css`.
