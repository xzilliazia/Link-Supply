import { getProductById } from '../data/products.js';
import { saveCart, state } from '../state.js';
import { lockPageScroll, requireEl } from '../utils/dom.js';
import { escapeHtml, formatIDR } from '../utils/format.js';
import { showToast } from './toast.js';

let els = null;

/* ---------- Template ---------- */

const emptyTemplate = `
  <div class="py-16 text-center">
    <span class="material-symbols-outlined text-6xl text-gray-300 mb-2">remove_shopping_cart</span>
    <h4 class="font-bold text-gray-800 mb-1">Keranjang Masih Kosong</h4>
    <p class="text-xs text-gray-500 mb-5">Belum ada komoditas atau pasokan yang Anda tambahkan.</p>
    <button type="button" class="bg-primary hover:bg-primary-dark text-white text-xs font-semibold py-2 px-4 rounded-lg cursor-pointer transition-colors shadow-xs" data-action="shop-now">
      Mulai Eksplor Produk
    </button>
  </div>
`;

const itemTemplate = (item) => {
  const name = escapeHtml(item.name);
  return `
    <div class="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-xs">
      <img src="${escapeHtml(item.image)}" alt="${name}" class="w-16 h-16 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-100">
      <div class="flex-1 min-w-0">
        <h5 class="text-xs sm:text-sm font-bold text-gray-900 truncate" title="${name}">${name}</h5>
        <div class="text-[11px] text-gray-500 mb-1.5">${formatIDR(item.price)} / ${item.priceUnit}</div>
        <div class="flex items-center justify-between gap-2">
          <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
            <button type="button" class="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-200 cursor-pointer text-xs" data-action="cart-minus" data-id="${item.id}" aria-label="Kurangi">-</button>
            <span class="w-8 text-center text-xs font-bold text-gray-800">${item.quantity}</span>
            <button type="button" class="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-200 cursor-pointer text-xs" data-action="cart-plus" data-id="${item.id}" aria-label="Tambah">+</button>
          </div>
          <div class="font-extrabold text-xs sm:text-sm text-primary-dark">${formatIDR(item.price * item.quantity)}</div>
        </div>
      </div>
      <button type="button" class="text-gray-300 hover:text-red-500 p-1.5 transition-colors cursor-pointer shrink-0" data-action="cart-remove" data-id="${item.id}" aria-label="Hapus Item">
        <span class="material-symbols-outlined text-lg">delete</span>
      </button>
    </div>
  `;
};

/* ---------- Tampilan ---------- */

const totalQuantity = () => state.cart.reduce((sum, item) => sum + item.quantity, 0);

const renderBadge = ({ animate = true } = {}) => {
  const total = totalQuantity();
  els.badge.classList.toggle('hidden', total === 0);
  els.badge.classList.toggle('flex', total > 0);
  if (total === 0) return;

  els.badge.textContent = total > 99 ? '99+' : total;
  if (animate) {
    els.badge.classList.add('badge-pop');
    setTimeout(() => els.badge.classList.remove('badge-pop'), 300);
  }
};

const renderDrawer = () => {
  els.countBadge.textContent = `${totalQuantity()} item`;
  els.items.innerHTML = state.cart.length ? state.cart.map(itemTemplate).join('') : emptyTemplate;
  els.subtotal.textContent = formatIDR(state.cart.reduce((sum, i) => sum + i.price * i.quantity, 0));
};

export const openCart = () => {
  renderDrawer();
  els.drawer.classList.remove('pointer-events-none', 'opacity-0');
  els.drawer.classList.add('opacity-100');
  els.panel.classList.remove('translate-x-full');
  els.panel.classList.add('translate-x-0');
  lockPageScroll(true);
};

export const closeCart = () => {
  els.panel.classList.remove('translate-x-0');
  els.panel.classList.add('translate-x-full');
  els.drawer.classList.remove('opacity-100');
  els.drawer.classList.add('opacity-0', 'pointer-events-none');
  lockPageScroll(false);
};

/* ---------- Operasi data ---------- */

const persist = () => {
  saveCart();
  renderBadge();
};

/**
 * Tambah produk ke keranjang.
 * - Produk baru  : jumlah awal = `quantity` jika diberikan, selain itu = minimal order.
 * - Sudah ada    : bertambah sebesar `quantity` (default 1).
 */
export const addToCart = (productId, quantity) => {
  const product = getProductById(productId);
  if (!product) return;

  const existing = state.cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity += quantity ?? 1;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      priceUnit: product.priceUnit,
      image: product.image,
      minOrder: product.minOrder,
      quantity: quantity ?? product.minOrder,
    });
  }

  persist();
  showToast(`<strong>${escapeHtml(product.name)}</strong> ditambahkan ke keranjang!`, 'success', 'add_shopping_cart');
};

export const removeFromCart = (productId) => {
  state.cart = state.cart.filter((item) => item.id !== Number(productId));
  persist();
  renderDrawer();
  showToast('Item dihapus dari keranjang', 'info', 'remove_shopping_cart');
};

export const changeCartQuantity = (productId, delta) => {
  const item = state.cart.find((i) => i.id === Number(productId));
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) return removeFromCart(productId);

  persist();
  renderDrawer();
};

/* ---------- Inisialisasi ---------- */

export const initCart = () => {
  els = {
    drawer: requireEl('cartDrawer'),
    panel: requireEl('cartPanel'),
    items: requireEl('cartItems'),
    subtotal: requireEl('cartSubtotal'),
    countBadge: requireEl('cartItemCount'),
    badge: requireEl('cartBadge'),
  };

  requireEl('btnCart').addEventListener('click', openCart);
  requireEl('cartBackdrop').addEventListener('click', closeCart);
  requireEl('btnCloseCart').addEventListener('click', closeCart);

  requireEl('btnCheckout').addEventListener('click', () => {
    if (state.cart.length === 0) {
      showToast('Keranjang Anda masih kosong!', 'warning', 'production_quantity_limits');
      return;
    }
    closeCart();
    showToast('Pesanan sedang diproses ke tahap pembayaran!', 'success', 'verified');
  });

  renderBadge({ animate: false });
};
