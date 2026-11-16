/** Semua angka & kunci yang sebelumnya tersebar sebagai "magic value". */
export const STORAGE_KEYS = {
  cart: 'linksupply_cart',
  wishlist: 'linksupply_wishlist',
};

export const CATALOG = {
  initialVisibleCount: 8, // jumlah kartu sebelum "Lihat Semua Produk"
  searchDebounceMs: 200,
};

export const SLIDER = {
  autoSlideMs: 5000,
  swipeThresholdPx: 50,
};

export const TOAST = {
  durationMs: 3000,
  exitMs: 350, // harus sama dengan durasi transisi .toast di css/style.css
};

export const BACK_TO_TOP_OFFSET_PX = 350;
