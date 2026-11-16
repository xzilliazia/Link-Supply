import { CATALOG } from '../config.js';
import { getCategoryLabel } from '../data/categories.js';
import { PRODUCTS } from '../data/products.js';
import { onFiltersChange } from '../filters.js';
import { state } from '../state.js';
import { requireEl, scrollToProducts } from '../utils/dom.js';
import { escapeHtml } from '../utils/format.js';
import { renderProductCard } from './productCard.js';

/* ---------- Logika murni: filter + urut (mudah diuji, tanpa DOM) ---------- */

const SORTERS = {
  default: (a, b) => a.id - b.id,
  'price-low': (a, b) => a.price - b.price,
  'price-high': (a, b) => b.price - a.price,
  'name-az': (a, b) => a.name.localeCompare(b.name, 'id'),
  'name-za': (a, b) => b.name.localeCompare(a.name, 'id'),
  'rating-high': (a, b) => b.rating - a.rating,
};

const matchesQuery = (product, query) =>
  [product.name, getCategoryLabel(product.category), product.location, product.desc].some((field) =>
    field.toLowerCase().includes(query),
  );

export const getVisibleProducts = (filters) => {
  const query = filters.query.toLowerCase().trim();

  return PRODUCTS.filter(
    (product) =>
      (filters.category === 'all' || product.category === filters.category) &&
      (filters.region === 'all' || product.province === filters.region) &&
      (!query || matchesQuery(product, query)),
  ).sort(SORTERS[filters.sort] ?? SORTERS.default);
};

/* ---------- Tampilan ---------- */

const emptyStateTemplate = (query) => `
  <div class="col-span-full py-16 px-4 text-center bg-white border border-dashed border-gray-300 rounded-xl shadow-xs">
    <span class="material-symbols-outlined text-6xl text-gray-300 mb-3 block">search_off</span>
    <h3 class="text-lg font-bold text-gray-800 mb-1">Produk Tidak Ditemukan</h3>
    <p class="text-sm text-gray-500 max-w-md mx-auto mb-5">
      ${query.trim() ? `Tidak ada produk yang cocok dengan pencarian "<strong>${escapeHtml(query)}</strong>" atau filter yang dipilih.` : 'Tidak ada produk yang cocok dengan filter yang dipilih.'}
    </p>
    <button type="button" class="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-semibold py-2.5 px-5 rounded-lg transition-colors cursor-pointer shadow-xs" data-action="reset-filters">
      <span class="material-symbols-outlined text-lg">restart_alt</span>
      Reset Semua Filter
    </button>
  </div>
`;

export const initCatalog = () => {
  const grid = requireEl('productGrid');
  const countEl = requireEl('productCount');
  const seeAllBox = requireEl('seeAllContainer');
  const seeAllBtn = requireEl('btnSeeAll');
  const seeAllLabel = requireEl('seeAllLabel');
  const seeAllIcon = requireEl('seeAllIcon');

  const setSeeAllVisible = (visible) => {
    seeAllBox.style.display = visible ? 'flex' : 'none';
  };

  const syncSeeAll = (total) => {
    if (total <= CATALOG.initialVisibleCount) return setSeeAllVisible(false);
    setSeeAllVisible(true);
    seeAllLabel.textContent = state.isExpanded ? 'Lihat Lebih Sedikit' : `Lihat Semua Produk (${total})`;
    seeAllIcon.textContent = state.isExpanded ? 'expand_less' : 'expand_more';
  };

  const render = () => {
    const products = getVisibleProducts(state.filters);
    countEl.textContent = `${products.length} produk`;

    if (products.length === 0) {
      grid.innerHTML = emptyStateTemplate(state.filters.query);
      setSeeAllVisible(false);
      return;
    }

    grid.innerHTML = products
      .map((product, index) =>
        renderProductCard(product, {
          isFavorited: state.wishlist.includes(product.id),
          isHidden: !state.isExpanded && index >= CATALOG.initialVisibleCount,
        }),
      )
      .join('');
    syncSeeAll(products.length);
  };

  seeAllBtn.addEventListener('click', () => {
    state.isExpanded = !state.isExpanded;
    render();
    if (!state.isExpanded) scrollToProducts();
  });

  onFiltersChange(render);
  render();
};
