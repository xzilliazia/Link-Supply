# 📄 Dokumentasi Pembaruan UI/UX & Interaktivitas JavaScript — LinkSupply

Dokumentasi ini menjelaskan pembaruan interaktivitas JavaScript dan peningkatan pengalaman pengguna (*User Interface / User Experience - UI/UX*) yang telah diterapkan pada aplikasi web **LinkSupply**.

---

## 🌟 Ringkasan Pembaruan (Executive Summary)

Sebelum pembaruan, antarmuka memiliki tata letak visual dasar dengan kartu produk statis (*placeholder skeleton*). Pembaruan ini menambahkan sistem JavaScript modern (*vanilla ES6+*) yang modular, ringan, tanpa dependensi eksternal tambahan, dan sepenuhnya terintegrasi dengan Tailwind CSS serta CSS kustom.

---

## 🚀 Fitur & Peningkatan Interaktivitas yang Ditambahkan

### 1. 🛍️ Katalog Produk Dinamis (*Dynamic Product Catalog*)
- **Dataset Terstruktur**: 12 komoditas B2B realistis disimpan di `js/product.json`, mencakup kategori Perikanan, Pertanian, Bahan Makanan, dan Perkebunan lengkap dengan informasi harga grosir per satuan, minimal pemesanan (*minimum order*), stok riil, lokasi asal penyuplai, rating bintang, jumlah terjual, dan badge status (*Terlaris, Segar, Organik, Standar SNI, dll.*). Aplikasi mengambil dataset melalui `fetch()` saat halaman dimuat; file JSON ini merupakan sumber data statis read-only, bukan backend untuk membuat atau mengubah produk.
- **Menjalankan katalog**: Buka halaman melalui server lokal seperti VS Code Live Server (bukan `file://`) agar browser dapat mengambil `js/product.json`. Jika permintaan gagal, katalog menampilkan pesan error dan detail teknisnya dicatat di console browser.
- **Animasi Kartu**: Efek *hover elevation*, *smooth zoom* pada gambar komoditas, dan animasi *fade-in* saat filter diterapkan.
- **Lihat Semua Produk (*Expand / Collapse*)**: Tampilan awal menampilkan 8 produk unggulan, dengan tombol interaktif untuk membuka seluruh 12 produk secara mulus (*smooth transition*).

### 2. 🔍 Pencarian Cerdas & Cepat (*Live Real-time Search*)
- **Instant Search with Debounce**: Menyaring katalog produk secara langsung saat pengguna mengetik kata kunci nama produk, kategori, lokasi, atau deskripsi (kecepatan respon 200ms debounce).
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

### 6. 🔍 Modal Detail Produk Cepat (*Quick View Modal*)
- Mengklik tombol **"Detail"** atau foto produk membuka *modal popup* beranimasi.
- Menampilkan:
  - Foto resolusi tinggi dan badge produk.
  - Informasi penyuplai, lokasi kota/provinsi, rating, dan status terverifikasi.
  - Deskripsi lengkap spesifikasi komoditas pasokan.
  - Stepper jumlah pesanan (*quantity selector*) yang disesuaikan dengan aturan minimal pemesanan (*minimum order*).
  - Tombol langsung **"Tambah ke Keranjang"**.
  - Aksesibilitas keyboard: tombol `Escape (ESC)` atau klik di luar modal (*backdrop*) untuk menutup modal.

### 7. ❤️ Favorit / Wishlist Interaktif
- Tombol ikon hati (*heart*) pada setiap kartu produk.
- Menambahkan atau menghapus produk dari daftar favorit dengan animasi hati menyala (*red fill*) dan notifikasi *toast*.
- Tersimpan di *LocalStorage*.

### 8. 🔔 Pusat Notifikasi (*Notification Dropdown Panel*)
- Ikon lonceng navbar dilengkapi indikator *unread counter*.
- Klik ikon membuka panel notifikasi (*promo panen raya, status armada logistik, pasokan baru*).
- Tombol **"Tandai dibaca"** untuk menghapus badge notifikasi yang belum dibaca.

### 9. 📍 Pemilih Wilayah Pemasok (*Location Selector Dropdown*)
- Klik tombol **"Lokasi"** di navbar membuka dropdown filter wilayah (*Semua Wilayah, Jawa Timur, Jawa Tengah, Jawa Barat*).
- Menyaring produk sesuai asal daerah penyuplai komoditas.

### 10. 🍞 Sistem Notifikasi Mengambang (*Floating Toast Feedback*)
- Notifikasi mengambang (*toast*) yang elegan di sudut kanan bawah untuk setiap aksi pengguna:
  - Berhasil menambahkan produk ke keranjang.
  - Berhasil mengubah kuantitas / menghapus produk.
  - Menambah / menghapus dari wishlist favorit.
  - Berhasil mendaftarkan email newsletter.
  - Reset filter.
- Otomatis hilang (*auto-dismiss*) setelah 3 detik atau dapat ditutup manual.

### 11. 🎞️ Slider Banner Hero Interaktif
- Pergantian slide otomatis (*auto-slide*) setiap 5 detik.
- Jeda otomatis (*pause on hover*) saat kursor diarahkan ke banner.
- Dukungan navigasi sentuh (*touch swipe gesture*) untuk layar *smartphone / tablet*.
- Tombol navigasi slide sebelumnya/berikutnya dan *dots indicator*.
- Tombol CTA banner yang langsung mengarahkan dan memfilter katalog produk terkait.

### 12. ⬆️ Tombol Melayang Kembali ke Atas (*Back to Top FAB*)
- Tombol melayang (*Floating Action Button*) muncul secara halus saat pengguna menggulir halaman ke bawah melebihi 350px.
- Mengklik tombol akan menggulirkan halaman kembali ke atas secara mulus (*smooth scroll*).

### 13. ✉️ Validasi & Umpan Balik Formulir Newsletter
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
│   │   ├── app.js              # Script utama interaktivitas aplikasi (Vanilla ES6+)
│   │   └── product.json        # Dataset produk yang dimuat oleh aplikasi
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
   - Klik tombol **"+ Keranjang"** pada salah satu produk.
   - Perhatikan animasi badge merah di ikon keranjang navbar.
   - Klik ikon keranjang untuk membuka drawer samping, ubah jumlah pesanan dengan tombol `+` / `-`, atau hapus produk.
3. **Uji Modal Detail Produk**:
   - Klik tombol **"Detail"** pada salah satu kartu produk atau klik gambarnya.
   - Ubah kuantitas pesanan pada modal dan klik **"Tambah ke Keranjang"**.
   - Tekan tombol `Escape` pada keyboard untuk menutup modal.
4. **Uji Wishlist Favorit**:
   - Klik ikon hati pada kartu produk untuk memfavoritkan.
5. **Uji Navigasi Responsif & Mobile**:
   - Buka pada perangkat bergerak atau gunakan *Responsive Mode* browser untuk menguji swipe banner hero dan tata letak responsif.

---
*Dibuat untuk meningkatkan interaksi, kegunaan (usability), dan estetika platform B2B LinkSupply.*
