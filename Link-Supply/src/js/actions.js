import { addToCart, changeCartQuantity, closeCart, removeFromCart } from './components/cart.js';
import { closeQuickView, openQuickView } from './components/quickView.js';
import { showToast } from './components/toast.js';
import { toggleFavorite } from './components/wishlist.js';
import { resetFilters } from './filters.js';
import { scrollToProducts } from './utils/dom.js';

/**
 * PETA AKSI KLIK — semua tombol dinamis memakai atribut `data-action="..."`.
 * Untuk menambah aksi baru: tambahkan satu baris di sini + atribut di template HTML-nya.
 * handler(element) menerima elemen yang membawa data-action (id produk ada di element.dataset.id).
 */
const ACTIONS = {
  'toggle-fav': (el) => toggleFavorite(Number(el.dataset.id), el),
  'add-cart': (el) => addToCart(Number(el.dataset.id)),
  quickview: (el) => openQuickView(Number(el.dataset.id)),
  'cart-plus': (el) => changeCartQuantity(el.dataset.id, 1),
  'cart-minus': (el) => changeCartQuantity(el.dataset.id, -1),
  'cart-remove': (el) => removeFromCart(el.dataset.id),
  'reset-filters': () => {
    resetFilters();
    showToast('Filter berhasil direset', 'info', 'restart_alt');
  },
  'shop-now': () => {
    closeCart();
    scrollToProducts();
  },
};

export const initActions = () => {
  // Satu listener untuk seluruh halaman. closest() mengambil data-action TERDEKAT,
  // jadi tombol favorit (di dalam area gambar yang juga klik-able) tetap menang.
  document.addEventListener('click', (event) => {
    const el = event.target.closest('[data-action]');
    ACTIONS[el?.dataset.action]?.(el);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    closeQuickView();
    closeCart();
  });
};
