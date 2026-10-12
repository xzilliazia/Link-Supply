import { state, formatIDR, escapeHtml } from './core.js';
import { fetchApiData } from './api.js';
import { Toast } from './toast.js';

  /* ==========================================================================
     5. PRODUCT CATALOG RENDERER & FILTERS
     ========================================================================== */
  const renderProducts = () => {
    const productGrid = document.getElementById('productGrid');
    const btnSeeAll = document.getElementById('btnSeeAll');

    if (!productGrid) return;

    if (state.productsLoading) {
      productGrid.innerHTML = `
        <div class="col-span-full py-16 px-4 text-center text-sm text-gray-500" role="status">
          Memuat katalog produk...
        </div>
      `;
      return;
    }

    if (state.productsError) {
      productGrid.innerHTML = `
        <div class="col-span-full py-16 px-4 text-center bg-white border border-dashed border-gray-300 rounded-xl shadow-xs" role="alert">
          <span class="material-symbols-outlined text-6xl text-gray-300 mb-3 block">cloud_off</span>
          <h3 class="text-lg font-bold text-gray-800 mb-1">Katalog Gagal Dimuat</h3>
          <p class="text-sm text-gray-500 mb-4">${escapeHtml(state.productsMessage)}</p>
          <button id="btnRetryProducts" class="bg-primary hover:bg-primary-dark text-white text-xs font-semibold py-2 px-4 rounded-lg cursor-pointer">Coba Lagi</button>
        </div>
      `;
      document.getElementById('btnRetryProducts')?.addEventListener('click', loadProducts);
      return;
    }

    // Filter products
    let filtered = state.products.filter(item => {
      // Category filter
      const matchesCategory = state.currentCategory === 'all' || item.category === state.currentCategory;
      
      // Location filter
      const matchesLocation = state.currentLocation === 'all' || item.province === state.currentLocation;

      // Search filter
      const query = state.searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        item.name.toLowerCase().includes(query) ||
        item.categoryLabel.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query) ||
        item.desc.toLowerCase().includes(query);

      return matchesCategory && matchesLocation && matchesSearch;
    });

    // Sort products
    switch (state.currentSort) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name-az':
        filtered.sort((a, b) => a.name.localeCompare(b.name, 'id'));
        break;
      case 'name-za':
        filtered.sort((a, b) => b.name.localeCompare(a.name, 'id'));
        break;
      case 'rating-high':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Default recommendation order (by original ID)
        filtered.sort((a, b) => a.id - b.id);
        break;
    }

    state.filteredProducts = filtered;

    // Handle Empty State
    if (filtered.length === 0) {
      productGrid.innerHTML = `
        <div class="col-span-full py-16 px-4 text-center bg-white border border-dashed border-gray-300 rounded-xl shadow-xs">
          <span class="material-symbols-outlined text-6xl text-gray-300 mb-3 block">search_off</span>
          <h3 class="text-lg font-bold text-gray-800 mb-1">Produk Tidak Ditemukan</h3>
          <p class="text-sm text-gray-500 max-w-md mx-auto mb-5">
            Tidak ada produk yang cocok dengan pencarian "<strong>${escapeHtml(state.searchQuery)}</strong>" atau kategori yang dipilih.
          </p>
          <button id="btnResetFilters" class="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white text-xs sm:text-sm font-semibold py-2.5 px-5 rounded-lg transition-colors cursor-pointer shadow-xs">
            <span class="material-symbols-outlined text-lg">restart_alt</span>
            Reset Semua Filter
          </button>
        </div>
      `;

      const btnReset = document.getElementById('btnResetFilters');
      if (btnReset) {
        btnReset.addEventListener('click', resetAllFilters);
      }

      if (btnSeeAll) {
        btnSeeAll.parentElement.style.display = 'none';
      }
      return;
    }

    // Render Cards
    productGrid.innerHTML = '';

    filtered.forEach((product, index) => {
      const isHidden = !state.isExpanded && index >= state.initialVisibleCount;

      const card = document.createElement('a');
      card.href = `./product.html?id=${encodeURIComponent(product.id)}`;
      card.className = `product-card bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col shadow-xs card-fade-in ${isHidden ? 'hidden-by-see-all' : ''}`;
      card.setAttribute('aria-label', `Lihat detail ${product.name}`);

      card.innerHTML = `
        <div class="card-img-wrap relative aspect-square w-full overflow-hidden bg-gray-100 group/img">
          <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" class="w-full h-full object-cover" loading="lazy">
        </div>

        <div class="card-body p-3 flex flex-col flex-1 gap-2">
          <h4 class="product-title font-medium text-gray-800 text-xs sm:text-sm leading-snug line-clamp-2 hover:text-primary transition-colors" title="${escapeHtml(product.name)}">
            ${escapeHtml(product.name)}
          </h4>

          <div class="card-meta flex justify-between items-center text-[11px] sm:text-xs text-text-muted">
            <span class="flex items-center gap-1">
              <span class="material-symbols-outlined text-sm" aria-hidden="true">location_on</span>
              <span class="truncate max-w-[120px]" title="${escapeHtml(product.location)}">${escapeHtml(product.location.split(',')[0])}</span>
            </span>
            <span class="flex items-center gap-0.5 text-amber-500 font-semibold">
              <span class="material-symbols-outlined text-sm text-amber-400" aria-hidden="true" style="font-variation-settings: 'FILL' 1;">star</span>
              ${product.rating}
            </span>
          </div>

          <div class="price-row mt-auto pt-1">
            <div class="text-primary-dark font-extrabold text-base sm:text-lg">
              ${formatIDR(product.price)} <span class="text-[11px] text-gray-500 font-normal">/${escapeHtml(product.priceUnit)}</span>
            </div>
          </div>

        </div>
      `;

      productGrid.appendChild(card);
    });

    // Update See All button visibility
    if (btnSeeAll) {
      if (filtered.length > state.initialVisibleCount) {
        btnSeeAll.parentElement.style.display = 'flex';
        const textSpan = btnSeeAll.querySelector('span:first-child');
        const iconSpan = btnSeeAll.querySelector('.material-symbols-outlined');
        
        if (state.isExpanded) {
          textSpan.textContent = 'Lihat Lebih Sedikit';
          iconSpan.textContent = 'expand_less';
        } else {
          textSpan.textContent = 'Lihat Semua Produk';
          iconSpan.textContent = 'expand_more';
        }
      } else {
        btnSeeAll.parentElement.style.display = 'none';
      }
    }
  };

  export const setCategoryFilter = (category) => {
    state.currentCategory = category;
    const pills = document.querySelectorAll('.category-pills .pill');
    pills.forEach(pill => {
      const pillCat = pill.dataset.category || 'all';
      if (pillCat === category) {
        pill.className = 'pill active flex items-center gap-1.5 bg-primary-dark text-bg-muted border border-primary-dark py-1.5 px-2.5 sm:px-3 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap shadow-xs cursor-pointer transition-all';
      } else {
        pill.className = 'pill flex items-center gap-1.5 bg-white text-text-main border border-border-custom hover:bg-emerald-50 hover:text-primary py-1.5 px-2.5 sm:px-3 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer';
      }
    });
    renderProducts();
  };

  const resetAllFilters = () => {
    state.currentCategory = 'all';
    state.currentLocation = 'all';
    state.searchQuery = '';
    state.currentSort = 'default';
    state.isExpanded = false;

    // Reset Search Input
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) searchInput.value = '';

    // Reset Sort select
    const sortSelect = document.getElementById('sortProducts');
    if (sortSelect) sortSelect.value = 'default';

    // Reset Location text
    const locationText = document.querySelector('.location span:last-child');
    if (locationText) locationText.textContent = 'Lokasi';

    setCategoryFilter('all');
    Toast.show('Filter berhasil direset', 'info', 'restart_alt');
  };


  /* ==========================================================================
     9. LOCATION SELECTOR
     ========================================================================== */
  const renderLocationOptions = () => {
    const dropdown = state.locationDropdown;
    if (!dropdown) return;
    dropdown.replaceChildren();
    const heading = document.createElement('div');
    heading.className = 'text-[11px] font-bold text-gray-400 px-3 py-1 uppercase tracking-wider';
    heading.textContent = 'Pilih Wilayah';
    dropdown.appendChild(heading);

    if (state.productsLoading) {
      const loading = document.createElement('div');
      loading.className = 'px-3 py-2 text-xs text-gray-500';
      loading.setAttribute('role', 'status');
      loading.textContent = 'Memuat wilayah...';
      dropdown.appendChild(loading);
      return;
    }
    if (state.productsError) {
      const error = document.createElement('div');
      error.className = 'px-3 py-2 text-xs text-red-600';
      error.setAttribute('role', 'alert');
      error.textContent = state.productsMessage;
      dropdown.appendChild(error);
      return;
    }

    const provinces = [...new Set(state.products.map(product => product.province))]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, 'id'));
    const locations = [{ id: 'all', label: 'Semua Wilayah' }, ...provinces.map(province => ({ id: province, label: province }))];
    locations.forEach(location => {
      const option = document.createElement('button');
      option.type = 'button';
      option.className = 'w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-emerald-50 hover:text-primary rounded-md font-medium cursor-pointer';
      option.dataset.loc = location.id;
      option.textContent = location.label;
      dropdown.appendChild(option);
    });
  };

  const initLocationSelector = () => {
    const locBtn = document.querySelector('.location');
    if (!locBtn) return;

    locBtn.classList.add('cursor-pointer', 'hover:text-primary', 'transition-colors');

    const dropdown = document.createElement('div');
    dropdown.className = 'loc-dropdown fixed bg-white border border-gray-200 rounded-xl shadow-xl py-2 px-1 z-50 hidden card-fade-in w-48';
    state.locationDropdown = dropdown;
    renderLocationOptions();
    document.body.appendChild(dropdown);

    locBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = dropdown.classList.toggle('hidden');
      if (!isHidden) {
        const rect = locBtn.getBoundingClientRect();
        dropdown.style.top = `${rect.bottom + 8}px`;
        dropdown.style.left = `${rect.left}px`;
      }
    });

    dropdown.addEventListener('click', (e) => {
      const option = e.target.closest('button[data-loc]');
      if (option) {
        const loc = option.dataset.loc;
        state.currentLocation = loc;
        const locLabel = locBtn.querySelector('span:last-child');
        if (locLabel) {
          locLabel.textContent = loc === 'all' ? 'Lokasi' : loc;
        }
        dropdown.classList.add('hidden');
        renderProducts();
        Toast.show(`Menampilkan pasokan wilayah: <strong>${loc === 'all' ? 'Semua Wilayah' : loc}</strong>`, 'info', 'location_on');
      }
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && !locBtn.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });
  };


  /* ==========================================================================
     11. SEARCH & SORT INTERACTION
     ========================================================================== */
  const initSearchAndSort = () => {
    const searchBar = document.querySelector('.search-bar');
    const searchInput = searchBar ? searchBar.querySelector('input') : null;
    const searchBtn = searchBar ? searchBar.querySelector('.btn-cari') : null;
    const sortSelect = document.getElementById('sortProducts');
    const btnSeeAll = document.getElementById('btnSeeAll');

    // Add Clear Button to Search Bar
    if (searchBar && searchInput) {
      const clearBtn = document.createElement('button');
      clearBtn.className = 'clear-search-btn text-gray-400 hover:text-gray-600 p-1 mr-1 hidden cursor-pointer';
      clearBtn.innerHTML = '<span class="material-symbols-outlined text-base">close</span>';
      searchBar.insertBefore(clearBtn, searchBtn);

      const updateClearButton = () => {
        clearBtn.classList.toggle('hidden', searchInput.value.trim().length === 0);
      };

      const handleSearch = () => {
        state.searchQuery = searchInput.value;
        updateClearButton();
        renderProducts();
      };

      searchInput.addEventListener('input', updateClearButton);

      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          handleSearch();
        }
      });

      if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
      }

      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.classList.add('hidden');
        state.searchQuery = '';
        renderProducts();
        searchInput.focus();
      });
    }

    // Sort Dropdown
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        state.currentSort = e.target.value;
        renderProducts();
      });
    }

    const pillsContainer = document.querySelector('.category-pills');
    if (pillsContainer) {
      pillsContainer.addEventListener('click', (e) => {
        const pill = e.target.closest('.pill[data-category]');
        if (!pill) return;
        e.preventDefault();
        setCategoryFilter(pill.dataset.category || 'all');
      });
    }

    // See All Button
    if (btnSeeAll) {
      btnSeeAll.addEventListener('click', () => {
        state.isExpanded = !state.isExpanded;
        renderProducts();
        if (!state.isExpanded) {
          document.getElementById('productGrid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  };


const loadProducts = async (signal) => {
    state.productsLoading = true;
    state.productsError = false;
    state.productsMessage = '';
    renderProducts();
    renderLocationOptions();

    try {
      const result = await fetchApiData('./js/product.json', { signal });
      const products = result.data;
      const requiredProductFields = ['name', 'category', 'categoryLabel', 'location', 'province', 'desc', 'image', 'priceUnit', 'minOrderUnit', 'stockUnit'];
      if (!Array.isArray(products) || products.some(product => (
        !product ||
        !Number.isInteger(product.id) ||
        requiredProductFields.some(field => typeof product[field] !== 'string') ||
        !Number.isFinite(product.price) ||
        !Number.isFinite(product.minOrder) ||
        !Number.isFinite(product.stock) ||
        !Number.isFinite(product.rating)
      ))) {
        throw new Error('Format data produk dari API tidak valid.');
      }

      state.products = products;
      state.filteredProducts = [...products];
      state.productsMessage = result.message;
      state.productsLoading = false;
      renderProducts();
      renderLocationOptions();
    } catch (error) {
      console.error('Unable to load the product dataset.', error);
      state.productsLoading = false;
      state.productsError = true;
      state.productsMessage = error instanceof Error ? error.message : String(error);
      renderProducts();
      renderLocationOptions();
    }
  };



export const initCatalog = (signal) => {
  initSearchAndSort();
  initLocationSelector();
  return loadProducts(signal);
};
