import { saveWishlist, state } from '../state.js';
import { showToast } from './toast.js';

/** Tambah/hapus produk dari favorit; `button` = tombol hati yang diklik. */
export const toggleFavorite = (productId, button) => {
  const index = state.wishlist.indexOf(productId);

  if (index === -1) {
    state.wishlist.push(productId);
    button.classList.add('favorited');
    showToast('Ditambahkan ke daftar favorit!', 'success', 'favorite');
  } else {
    state.wishlist.splice(index, 1);
    button.classList.remove('favorited');
    showToast('Dihapus dari daftar favorit', 'info', 'favorite_border');
  }
  saveWishlist();
};
