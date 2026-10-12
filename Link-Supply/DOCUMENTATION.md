# 📄 Dokumentasi Pembaruan UI/UX & Interaktivitas JavaScript — LinkSupply

Dokumentasi ini menjelaskan pembaruan interaktivitas JavaScript dan peningkatan pengalaman pengguna (*User Interface / User Experience - UI/UX*) yang telah diterapkan pada aplikasi web **LinkSupply**.

---

## 🌟 Ringkasan Pembaruan (Executive Summary)

Sebelum pembaruan, antarmuka memiliki tata letak visual dasar dengan kartu produk statis (*placeholder skeleton*). Pembaruan ini menambahkan sistem JavaScript modern (*vanilla ES6+*) yang modular, ringan, tanpa dependensi eksternal tambahan, dan sepenuhnya terintegrasi dengan Tailwind CSS serta CSS kustom.

---

## 🚀 Fitur & Peningkatan Interaktivitas yang Ditambahkan

### 0.1. 🖼️ Skeleton Gambar
- Semua gambar di halaman utama dan pembayaran menampilkan placeholder shimmer sampai berhasil dimuat; gambar yang gagal berhenti beranimasi.
- Pemantauan mencakup gambar yang dimuat secara dinamis, seperti kartu produk, detail produk, dan item keranjang.

### 0. ⏳ Layar Loading Halaman
- Layar loading menutupi konten sampai browser selesai memuat halaman dan request awal katalog serta kategori/notifikasi selesai.
- Jika request awal data belum selesai dalam 15 detik, request dibatalkan dan halaman menampilkan layar error penuh dengan tombol **Coba Lagi**.
- Jika request data gagal, layar loading tetap ditutup agar pesan error dan tombol **Coba Lagi** yang sudah tersedia dapat digunakan.

### 1. 🛍️ Katalog Produk Dinamis (*Dynamic Product Catalog*)
- **Data dari PHP**: Katalog produk disimpan sebagai array PHP di `products-data.php` dan disajikan melalui `products-api.php` dalam format `{ "success": true, "message": "...", "data": ... }`. Kategori dan notifikasi tetap dibaca dari `js/site.json`.
- **Server-side rendering**: `index.php` mengulang array katalog dengan `foreach` dan mengirim kartu produk sebagai HTML pada respons awal. JavaScript memakai data server-rendered untuk filter, pencarian, dan pengurutan tanpa request katalog kedua.
- **Status request API**: Produk, kategori, notifikasi, dan pilihan wilayah menampilkan status loading. Katalog, notifikasi, dan rincian produk di halaman pembayaran menampilkan pesan error dari API serta aksi **Coba Lagi** jika request gagal.
- **Menjalankan situs lokal**: Jalankan `php -S localhost:8000 -t Link-Supply` dari root repositori dan buka `http://localhost:8000/index.php`. PHP diperlukan untuk SSR katalog, endpoint data, dan halaman detail.
- **CSS Tailwind via NPM**: Jalankan `npm install` dari root repositori, kemudian `npm run build:css` untuk membuat `Link-Supply/css/tailwind.css`. Gunakan `npm run watch:css` saat mengembangkan UI; tidak ada Tailwind CDN yang digunakan.
- **Kartu Produk**: Kartu marketplace responsif; memilih kartu akan membuka detail dan opsi pemesanan.
- **Katalog 24 Produk**: Seluruh 24 produk dari API dimuat dan ditampilkan sejak awal. Tombol perluasan otomatis disembunyikan jika semua produk sudah terlihat.

### 2. 🔍 Pencarian Produk
- Pencarian berdasarkan nama produk, kategori, lokasi, atau deskripsi diterapkan setelah pengguna menekan `Enter` atau tombol **Cari**.
- **Tombol Hapus Pencarian (Clear 'X')**: Tombol cepat untuk menghapus teks pencarian dan mengembalikan daftar produk.
- **Empty State Informatif**: Jika pencarian tidak menemukan hasil, ditampilkan ilustrasi *empty state* yang ramah disertai tombol **"Reset Semua Filter"**.

### 3. 🏷️ Navigasi & Filter Kategori (*Category Filter Pills*)
- Pengguna dapat mengklik pill kategori:
  - `Semua`
  - `Perikanan`
  - `Pertanian`
  - `Bahan Makanan`
  - `Perkebunan`
- Status aktif (*active state*) berpindah secara dinamis dengan penyesuaian jumlah produk yang tersedia secara *real-time*.

### 4. 🔄 Pengurutan Multi-Kriteria (*Sorting Engine*)
Dropdown pengurutan produk yang responsif mendukung:
- **Rekomendasi** (Urutan bawaan)
- **Harga Terendah** (Termurah ke termahal)
- **Harga Tertinggi** (Termahal ke termurah)
- **Nama A - Z**
- **Nama Z - A**
- **Rating Tertinggi**

### 5. 🛒 Keranjang Belanja Interaktif (*Cart Drawer Sidebar & Badge Count*)
- **Badge Counter Animasi**: Ikon keranjang di navbar menampilkan jumlah item yang otomatis bertambah dengan efek *bounce pop animation*.
- **Slide-out Cart Drawer**:
  - Panel samping (*offcanvas*) yang meluncur mulus dari sisi kanan saat ikon keranjang diklik.
  - Kontrol kuantitas (`+` / `-` / hapus item).
  - Kalkulasi subtotal harga otomatis.
  - State kosong (*Empty Cart*) dengan tombol ajakan *"Mulai Eksplor Produk"*.
  - Penyimpanan persisten lokal (*LocalStorage*) sehingga keranjang tidak hilang saat halaman dimuat ulang.

### 6. 🔍 Detail Produk & Pemesanan
- Mengklik atau memfokuskan kartu produk lalu menekan `Enter` membuka halaman detail produk (`product.php?id=...`), dengan data produk dipilih di sisi server.
- Halaman detail dirender di sisi server oleh `product.php` dan `product-detail-view.php`. JavaScript hanya mengaktifkan kontrol browser seperti galeri, jumlah sesuai minimal pesanan/stok, dan aksi keranjang.
- Data katalog berbentuk array multidimensi PHP. Loop `foreach` mencari produk berdasarkan ID dan merender galeri, distribusi rating, serta daftar ulasan; kondisi stok menentukan label dan pesan status pasokan.
- Halaman detail mempertahankan navbar dan footer utama, serta menampilkan ringkasan rating, jumlah ulasan, distribusi bintang, dan ulasan contoh yang diberi label sebagai data pratinjau.
- Tata letak desktop membagi galeri, informasi produk, dan kartu pembelian lengket; tablet menempatkan kartu pembelian setelah detail, sedangkan ponsel menggunakan bilah pembelian tetap di bawah layar.
- Menampilkan:
  - Foto produk tanpa label promosi.
  - Lokasi asal, kategori, harga, status ketersediaan, jumlah stok, jumlah terjual, dan rating produk.
  - Deskripsi produk dan daftar spesifikasi yang mudah dipindai.
  - Ringkasan rating dengan jumlah dan distribusi ulasan, lalu ulasan contoh berisi nama, rating, tanggal, dan komentar.
  - Stepper jumlah pesanan (*quantity selector*) yang disesuaikan dengan aturan minimal pemesanan (*minimum order*).
  - Tombol **"Tambah ke Keranjang"** pada halaman detail produk.

### 7. 🔔 Pusat Notifikasi (*Notification Dropdown Panel*)
- Ikon lonceng navbar dilengkapi indikator *unread counter*.
- Klik ikon membuka panel notifikasi (*promo panen raya, status armada logistik, pasokan baru*).
- Tombol **"Tandai dibaca"** untuk menghapus badge notifikasi yang belum dibaca.

### 8. 📍 Pemilih Wilayah Pemasok (*Location Selector Dropdown*)
- Klik tombol **"Lokasi"** di navbar membuka dropdown filter wilayah (*Semua Wilayah, Jawa Timur, Jawa Tengah, Jawa Barat*).
- Menyaring produk sesuai asal daerah penyuplai komoditas.

### 9. 🍞 Sistem Notifikasi Mengambang (*Floating Toast Feedback*)
- Notifikasi mengambang (*toast*) yang elegan di sudut kanan bawah untuk setiap aksi pengguna:
  - Berhasil menambahkan produk ke keranjang.
  - Berhasil mengubah kuantitas / menghapus produk.
  - Berhasil mendaftarkan email newsletter.
  - Reset filter.
- Otomatis hilang (*auto-dismiss*) setelah 3 detik atau dapat ditutup manual.

### 10. 🎞️ Slider Banner Hero Interaktif
- Pergantian slide otomatis (*auto-slide*) setiap 5 detik.
- Jeda otomatis (*pause on hover*) saat kursor diarahkan ke banner.
- Gambar hanya diminta saat slidenya ditampilkan; gambar pertama diprioritaskan. Jika gambar gagal dimuat, gradien latar tetap terlihat di belakang teks.
- Dukungan navigasi sentuh (*touch swipe gesture*) untuk layar *smartphone / tablet*.
- Tombol navigasi slide sebelumnya/berikutnya dan *dots indicator*.
- Tombol CTA banner yang langsung mengarahkan dan memfilter katalog produk terkait.

### 11. ⬆️ Tombol Melayang Kembali ke Atas (*Back to Top FAB*)
- Tombol melayang (*Floating Action Button*) muncul secara halus saat pengguna menggulir halaman ke bawah melebihi 350px.
- Mengklik tombol akan menggulirkan halaman kembali ke atas secara mulus (*smooth scroll*).

### 12. ✉️ Validasi & Umpan Balik Formulir Newsletter
- Validasi email saat pengguna menekan tombol **"LANGGANAN"** di bagian *footer*.
- Menampilkan pesan konfirmasi sukses pendaftaran melalui sistem *toast*.

---

## 📁 Struktur File Proyek Terkini

```
Link-Supply/
├── Link-Supply/
│   ├── Assets/
│   │   ├── alfamart-seeklogo.png
│   │   ├── gopay-seeklogo.png
│   │   ├── shopeepay.png
│   │   ├── pexels-1135897-30199346.jpg
│   │   ├── pexels-kevin-malik-9016541.jpg
│   │   ├── pexels-nicolas-rueda-175965148-17546504.jpg
│   │   ├── pexels-shvets-production-8900041.jpg
│   │   ├── pexels-strannik-sk-36849925.jpg
│   │   ├── pexels-tima-miroshnichenko-6169177.jpg
│   │   └── pexels-yuslava-36897781.jpg
│   ├── css/
│   │   └── style.css            # Stylesheet kustom untuk animasi, drawer, detail produk, toast, dll.
│   ├── js/
│   │   ├── app.js              # Entry point dan inisialisasi modul ESM
│   │   ├── api.js              # Fetch serta validasi envelope API JSON
│   │   ├── core.js             # State aplikasi dan utilitas bersama
│   │   ├── toast.js            # Sistem notifikasi toast
│   │   ├── catalog.js          # Render, filter, urut, dan muat katalog produk
│   │   ├── cart.js             # Keranjang dan drawer belanja
│   │   ├── profile.js          # Profil dan manajemen alamat
│   │   ├── product-page.js     # Interaksi browser detail produk
│   │   ├── site-ui.js          # Slider, notifikasi situs, lokasi, dan back-to-top
│   │   ├── events.js           # Delegasi event global dan newsletter
│   │   └── site.json           # Data kategori dan notifikasi
│   ├── products-data.php       # Data katalog dalam array PHP
│   ├── products-api.php        # Endpoint JSON untuk katalog dan checkout
│   ├── product-detail-view.php # Template PHP untuk tampilan detail produk
│   ├── index.php               # Halaman utama dan grid katalog server-rendered
│   ├── product.php             # Halaman detail produk berdasarkan ID katalog
│   ├── payment.html            # Halaman checkout dan pembayaran
│   └── DOCUMENTATION.md        # Dokumentasi lengkap pembaruan
└── .vscode/
    └── settings.json
```

---

## 🛠️ Panduan Pengujian & Verifikasi Fitur

1. **Uji Filter & Pencarian**:
   - Ketik kata kunci seperti `"beras"`, `"ikan"`, atau `"kopi"` pada kolom pencarian di navbar.
   - Klik kategori seperti **Perikanan** atau **Pertanian** pada deretan tombol kategori.
   - Pilih pengurutan **Harga Terendah** atau **Rating Tertinggi** pada dropdown *Urutkan*.
2. **Uji Keranjang Belanja**:
   - Klik kartu produk, pilih jumlah pada panel detail, lalu klik **"Tambah ke Keranjang"**.
   - Perhatikan animasi badge merah di ikon keranjang navbar.
   - Klik ikon keranjang untuk membuka drawer samping, ubah jumlah pesanan dengan tombol `+` / `-`, atau hapus produk.
3. **Uji Halaman Detail Produk**:
   - Klik kartu produk atau fokuskan dengan keyboard lalu tekan `Enter`.
   - Pastikan deskripsi, spesifikasi, ringkasan ulasan, distribusi rating, dan ulasan contoh tampil.
   - Ubah kuantitas pesanan sesuai minimal dan stok, lalu klik **"Tambah ke Keranjang"**.
4. **Uji Navigasi Responsif & Mobile**:
   - Buka pada perangkat bergerak atau gunakan *Responsive Mode* browser untuk menguji swipe banner hero dan tata letak halaman detail serta ulasan.

---
*Dibuat untuk meningkatkan interaksi, kegunaan (usability), dan estetika platform B2B LinkSupply.*
