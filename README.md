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

### Struktur Aplikasi
Data katalog dikelola sebagai array PHP di `Link-Supply/products-data.php`. Halaman katalog (`Link-Supply/index.php`) merender grid kartu produk di sisi server, sementara detail (`Link-Supply/product.php` dan `Link-Supply/product-detail-view.php`) merender halaman produk. `Link-Supply/products-api.php` menyediakan data untuk checkout. JavaScript menangani filter katalog dan interaksi browser seperti galeri, kuantitas, dan keranjang.

### Pemrosesan Data PHP
- `$products` adalah array multidimensi: setiap elemen menyimpan field satu produk.
- `foreach` mencari produk berdasarkan ID, lalu mengulang data galeri, pilihan pasokan, bintang, dan ulasan untuk merender HTML.
- Kondisi `if` menentukan status stok (`Siap dipasok` atau `Stok habis`) dan pesan ketersediaannya sebelum halaman dikirim ke browser.
- `$productView` mengelompokkan informasi ke array bersarang seperti `pricing`, `inventory`, `rating`, dan `specs` agar struktur data tetap jelas.

---

## 📖 Dokumentasi Lengkap
Dokumentasi teknis pembaruan dapat dibaca di:
👉 [Link-Supply/DOCUMENTATION.md](Link-Supply/DOCUMENTATION.md)

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
