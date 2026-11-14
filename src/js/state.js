import { STORAGE_KEYS } from './config.js';
import { NOTIFICATIONS } from './data/notifications.js';
import { readJSON, writeJSON } from './utils/storage.js';

export const DEFAULT_FILTERS = Object.freeze({
  category: 'all',
  region: 'all',
  query: '',
  sort: 'default',
});

const isValidCartItem = (item) =>
  item && Number.isFinite(item.id) && Number.isFinite(item.quantity) && item.quantity > 0;

const loadCart = () => {
  const stored = readJSON(STORAGE_KEYS.cart, []);
  return Array.isArray(stored) ? stored.filter(isValidCartItem) : [];
};

const loadWishlist = () => {
  const stored = readJSON(STORAGE_KEYS.wishlist, []);
  return Array.isArray(stored) ? stored.filter(Number.isFinite) : [];
};

/** State global. Ubah filter hanya lewat js/filters.js agar UI ikut ter-update. */
export const state = {
  filters: { ...DEFAULT_FILTERS },
  isExpanded: false, // true = "Lihat Semua Produk" sedang terbuka
  cart: loadCart(), // [{ id, name, price, priceUnit, image, minOrder, quantity }]
  wishlist: loadWishlist(), // [productId, ...]
  unreadNotifications: NOTIFICATIONS.length,
};

export const saveCart = () => writeJSON(STORAGE_KEYS.cart, state.cart);
export const saveWishlist = () => writeJSON(STORAGE_KEYS.wishlist, state.wishlist);
