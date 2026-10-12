# 📄 Dokumentasi Pembaruan UI/UX & Interaktivitas JavaScript — LinkSupply

Dokumentasi ini menjelaskan pembaruan interaktivitas JavaScript dan peningkatan pengalaman pengguna (*User Interface / User Experience - UI/UX*) yang telah diterapkan pada aplikasi web **LinkSupply**.

---

## 🌟 Ringkasan Pembaruan (Executive Summary)

Sebelum pembaruan, antarmuka memiliki tata letak visual dasar dengan kartu produk statis (*placeholder skeleton*). Pembaruan ini menambahkan sistem JavaScript modern (*vanilla ES6+*) yang modular, ringan, tanpa dependensi eksternal tambahan, dan sepenuhnya terintegrasi dengan Tailwind CSS serta CSS kustom.

---

## 🚀 Fitur & Peningkatan Interaktivitas yang Ditambahkan

### 1. 🛍️ Katalog Produk Dinamis (*Dynamic Product Catalog*)
- **Data dari API JSON lokal**: Katalog produk dibaca dari `js/product.json`; kategori dan notifikasi dibaca dari `js/site.json`. Keduanya menggunakan `fetch()` dan format respons `{ "success": true, "message": "...", "data": ... }`. Berkas-berkas ini adalah sumber data statis read-only, bukan backend untuk membuat atau mengubah data.
- **Status request API**: Produk, kategori, notifikasi, dan pilihan wilayah menampilkan status loading. Katalog, notifikasi, dan rincian produk di halaman pembayaran menampilkan pesan error dari API serta aksi **Coba Lagi** jika request gagal.
- **Menjalankan API lokal**: Jalankan folder `Link-Supply` melalui server lokal seperti VS Code Live Server lalu buka `index.html` dari alamat server (bukan `file://`) agar browser dapat mengambil berkas JSON.
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
- Mengklik kartu produk atau memfokuskannya lalu menekan `Enter` / `Space` membuka *modal popup* beranimasi. Kartu tidak menampilkan badge promosi maupun tombol favorit, detail, atau keranjang.
- Menampilkan:
  - Foto resolusi tinggi tanpa label promosi produk.
  - Informasi penyuplai, lokasi kota/provinsi, rating, dan status terverifikasi.
  - Deskripsi lengkap spesifikasi komoditas pasokan.
  - Stepper jumlah pesanan (*quantity selector*) yang disesuaikan dengan aturan minimal pemesanan (*minimum order*).
  - Tombol **"Tambah ke Keranjang"** hanya tersedia setelah detail produk dibuka.
  - Aksesibilitas keyboard: tombol `Escape (ESC)` atau klik di luar modal (*backdrop*) untuk menutup modal.

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
│   │   └── style.css            # Stylesheet kustom untuk animasi, drawer, modal, toast, dll.
│   ├── js/
│   │   ├── app.js              # Entry point dan inisialisasi modul ESM
│   │   ├── api.js              # Fetch serta validasi envelope API JSON
│   │   ├── core.js             # State aplikasi dan utilitas bersama
│   │   ├── toast.js            # Sistem notifikasi toast
│   │   ├── catalog.js          # Render, filter, urut, dan muat katalog produk
│   │   ├── cart.js             # Keranjang dan drawer belanja
│   │   ├── profile.js          # Profil dan manajemen alamat
│   │   ├── product-detail.js   # Detail produk dan pemesanan
│   │   ├── site-ui.js          # Slider, notifikasi situs, lokasi, dan back-to-top
│   │   ├── events.js           # Delegasi event global dan newsletter
│   │   ├── product.json        # Data katalog produk
│   │   └── site.json           # Data kategori dan notifikasi
│   ├── index.html              # Halaman utama aplikasi LinkSupply
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
3. **Uji Modal Detail Produk**:
   - Klik kartu produk atau fokuskan dengan keyboard lalu tekan `Enter` / `Space`.
   - Ubah kuantitas pesanan pada modal dan klik **"Tambah ke Keranjang"**.
   - Tekan tombol `Escape` pada keyboard untuk menutup modal.
4. **Uji Navigasi Responsif & Mobile**:
   - Buka pada perangkat bergerak atau gunakan *Responsive Mode* browser untuk menguji swipe banner hero dan tata letak responsif.

---
*Dibuat untuk meningkatkan interaksi, kegunaan (usability), dan estetika platform B2B LinkSupply.*
