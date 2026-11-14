import { formatIDR, formatNumber, escapeHtml } from '../utils/format.js';

/**
 * Template satu kartu produk (mengembalikan string HTML).
 * Aksi tombol ditangani oleh js/actions.js lewat atribut data-action.
 */
export const renderProductCard = (product, { isFavorited, isHidden }) => {
  const name = escapeHtml(product.name);
  const city = escapeHtml(product.location.split(',')[0]);

  return `
    <div class="product-card bg-white border border-border-custom rounded-lg overflow-hidden flex flex-col shadow-xs card-fade-in ${isHidden ? 'hidden-by-see-all' : ''}" data-id="${product.id}">
      <div class="card-img-wrap relative h-[145px] sm:h-[155px] w-full overflow-hidden bg-gray-100 cursor-pointer" data-action="quickview" data-id="${product.id}">
        <img src="${escapeHtml(product.image)}" alt="${name}" class="w-full h-full object-cover" loading="lazy">
        <span class="absolute top-2.5 left-2.5 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded border ${product.badgeColor} shadow-xs backdrop-blur-xs">
          ${escapeHtml(product.badge)}
        </span>
        <button type="button" class="btn-fav absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-400 hover:text-red-500 shadow-sm flex items-center justify-center cursor-pointer ${isFavorited ? 'favorited' : ''}" data-action="toggle-fav" data-id="${product.id}" aria-label="Favoritkan">
          <span class="material-symbols-outlined text-lg">favorite</span>
        </button>
      </div>

      <div class="card-body p-3 sm:p-3.5 flex flex-col flex-1 gap-2">
        <div class="flex justify-between items-center text-[11px] sm:text-xs text-text-muted">
          <span class="flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">location_on</span>
            <span class="truncate max-w-[120px]" title="${escapeHtml(product.location)}">${city}</span>
          </span>
          <span class="flex items-center gap-0.5 text-amber-500 font-semibold">
            <span class="material-symbols-outlined text-sm text-amber-400" style="font-variation-settings: 'FILL' 1;">star</span>
            ${product.rating}
          </span>
        </div>

        <h4 class="font-bold text-gray-900 text-xs sm:text-sm line-clamp-2 hover:text-primary transition-colors cursor-pointer" data-action="quickview" data-id="${product.id}" title="${name}">
          ${name}
        </h4>

        <p class="text-[11px] text-gray-500 line-clamp-1">
          Min. Order: <strong class="text-gray-700 font-medium">${product.minOrder} ${product.minOrderUnit}</strong>
        </p>

        <div class="flex justify-between items-end border-b border-dashed border-border-custom pb-2.5 mt-auto">
          <div>
            <div class="text-[10px] text-gray-500 font-medium">Harga Grosir</div>
            <div class="text-primary-dark font-extrabold text-sm sm:text-base">
              ${formatIDR(product.price)} <span class="text-[10px] text-gray-500 font-normal">/${product.priceUnit}</span>
            </div>
          </div>
          <div class="text-right">
            <div class="text-[10px] text-gray-400">Stok</div>
            <div class="text-xs font-semibold text-gray-700">${formatNumber(product.stock)} ${product.stockUnit}</div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-1.5 pt-1">
          <button type="button" class="bg-white hover:bg-gray-50 text-text-main border border-border-custom text-xs font-semibold py-1.5 px-2 rounded-md transition-colors flex items-center justify-center gap-1 cursor-pointer" data-action="quickview" data-id="${product.id}">
            <span class="material-symbols-outlined text-sm">visibility</span>
            <span>Detail</span>
          </button>
          <button type="button" class="bg-primary hover:bg-primary-dark active:scale-95 text-white text-xs font-semibold py-1.5 px-2 rounded-md transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer" data-action="add-cart" data-id="${product.id}">
            <span class="material-symbols-outlined text-sm">add_shopping_cart</span>
            <span>+ Keranjang</span>
          </button>
        </div>
      </div>
    </div>
  `;
};
