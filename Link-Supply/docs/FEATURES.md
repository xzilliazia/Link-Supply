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
- **Model OOP**: `resources/data/products.json` menyimpan data katalog; `App\Models\Product` memodelkan produk dengan property `private readonly`, dan `App\Services\ProductCatalog` memuat serta mencari kumpulan object produk.
- **Arsitektur MVC Laravel**: `routes/web.php` menghubungkan URL katalog, detail, dan API dengan controller Laravel. Controller mengambil data melalui service/model, lalu meneruskannya ke Blade atau API JSON.
- **Server-side rendering**: `CatalogController` meneruskan object katalog ke `resources/views/catalog.blade.php` agar kartu produk tersedia pada respons awal. JavaScript menggunakan endpoint `/api/products` untuk interaksi katalog.
- **Status request API**: Produk, kategori, notifikasi, dan pilihan wilayah menampilkan status loading. Katalog, notifikasi, dan rincian produk di halaman pembayaran menampilkan pesan error dari API serta aksi **Coba Lagi** jika request gagal.
- **Menjalankan situs lokal**: Jalankan `php artisan serve` dari direktori Laravel dan buka `http://127.0.0.1:8000`, atau gunakan virtual host Laragon yang mengarah ke folder `public`.
- **Aset CSS**: CSS hasil build tersedia di `public/css/tailwind.css`; sumber input Tailwind yang dimigrasikan tersedia di `resources/css/linksupply.input.css`.
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
- Mengklik atau memfokuskan kartu produk lalu menekan `Enter` membuka halaman detail produk (`/products/{id}`), dengan data produk dipilih di sisi server.
- Halaman detail dirender di sisi server oleh `App\Http\Controllers\ProductController` dan `resources/views/product.blade.php`. Detail menampilkan foto, harga, deskripsi, kategori, lokasi, minimum pesanan, dan stok dari produk terpilih; JavaScript menangani jumlah pesanan dan aksi keranjang.
- `ProductCatalog` mencari object berdasarkan ID; Model `Product` menyiapkan data detail, distribusi rating, dan status stok untuk View. API mengubah object ke array JSON agar bentuk respons katalog dan integrasi checkout tetap kompatibel.
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

## 📁 Struktur Folder Proyek

```
link-Supply/
├── app/
│   ├── Http/Controllers/            # Controller katalog, detail, dan API
│   ├── Models/Product.php           # Model produk
│   ├── Services/ProductCatalog.php  # Pembacaan data katalog JSON
│   └── Support/                     # Tampilan detail dan helper format
├── docs/FEATURES.md
├── public/
│   ├── assets/                      # Foto produk dan logo pembayaran
│   ├── css/                         # CSS hasil build dan gaya kustom
│   └── js/                          # Modul JavaScript dan data UI
├── resources/
│   ├── data/products.json           # Data katalog
│   └── views/                       # Halaman Blade katalog, detail, checkout
└── routes/web.php                   # Rute halaman dan API
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
