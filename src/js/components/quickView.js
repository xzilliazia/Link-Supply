import { getProductById } from '../data/products.js';
import { lockPageScroll, requireEl } from '../utils/dom.js';
import { formatIDR, formatNumber } from '../utils/format.js';
import { addToCart } from './cart.js';

let modal = null;
let content = null;
let qtyInput = null;
let product = null; // produk yang sedang dibuka
let quantity = 1;

const setQuantity = (value) => {
  quantity = value;
  qtyInput.value = value;
};

export const openQuickView = (productId) => {
  product = getProductById(productId);
  if (!product) return;

  const set = (id, text) => (requireEl(id).textContent = text);

  const img = requireEl('modalImg');
  img.src = product.image;
  img.alt = product.name;

  const badge = requireEl('modalBadge');
  badge.textContent = product.badge;
  badge.className = `absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded shadow-xs ${product.badgeColor}`;

  set('modalLocation', product.location);
  set('modalTitle', product.name);
  set('modalRating', product.rating);
  set('modalSold', `Terjual ${product.soldCount}`);
  set('modalPrice', formatIDR(product.price));
  set('modalUnit', ` / ${product.priceUnit}`);
  set('modalDesc', product.desc);
  set('modalMinOrder', `${product.minOrder} ${product.minOrderUnit}`);
  set('modalStock', `${formatNumber(product.stock)} ${product.stockUnit}`);
  setQuantity(product.minOrder);

  modal.classList.remove('pointer-events-none', 'opacity-0');
  modal.classList.add('opacity-100');
  content.classList.remove('scale-95', 'opacity-0');
  content.classList.add('scale-100', 'opacity-100');
  lockPageScroll(true);
};

export const closeQuickView = () => {
  content.classList.remove('scale-100', 'opacity-100');
  content.classList.add('scale-95', 'opacity-0');
  modal.classList.remove('opacity-100');
  modal.classList.add('opacity-0', 'pointer-events-none');
  lockPageScroll(false);
};

export const initQuickView = () => {
  modal = requireEl('quickViewModal');
  content = requireEl('quickViewContent');
  qtyInput = requireEl('modalQtyInput');

  const minQuantity = () => (product ? product.minOrder : 1);

  requireEl('quickViewBackdrop').addEventListener('click', closeQuickView);
  requireEl('btnCloseModal').addEventListener('click', closeQuickView);

  requireEl('modalQtyMinus').addEventListener('click', () => {
    if (quantity > minQuantity()) setQuantity(quantity - 1);
  });
  requireEl('modalQtyPlus').addEventListener('click', () => setQuantity(quantity + 1));

  qtyInput.addEventListener('change', () => {
    const value = parseInt(qtyInput.value, 10);
    setQuantity(Number.isNaN(value) || value < minQuantity() ? minQuantity() : value);
  });

  requireEl('modalBtnAddCart').addEventListener('click', () => {
    if (!product) return;
    addToCart(product.id, quantity);
    closeQuickView();
  });
};
