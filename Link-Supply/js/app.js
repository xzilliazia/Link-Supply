/**
 * LinkSupply - Main Interactive JavaScript Application
 * Provides modular UI/UX enhancements:
 * - Product Catalog (Dynamic Rendering, Multi-Category Filtering, Live Search, Multi-Option Sorting)
 * - Interactive Shopping Cart Drawer with Badge Count & LocalStorage Persistence
 * - Product Quick View Modal with Live Price & Quantity Calculation
 * - Wishlist / Favorite Heart Toggle with LocalStorage
 * - Notification Center Dropdown with Unread Counter
 * - Banner Hero Carousel Slider with Auto-slide & Touch Swipe
 * - Floating Back-To-Top Button
 * - Lightweight Toast Notification System
 * - Location Filter Selector
 * - Newsletter Form Feedback
 */

(() => {
  'use strict';

  /* ==========================================================================
     1. APPLICATION STATE
     ========================================================================== */
  const state = {
    products: [],
    filteredProducts: [],
    productsLoading: true,
    productsError: false,
    currentCategory: 'all',
    currentLocation: 'all',
    searchQuery: '',
    currentSort: 'default',
    isExpanded: false,
    initialVisibleCount: 8,
    cart: JSON.parse(localStorage.getItem('linksupply_cart') || '[]'),
    wishlist: JSON.parse(localStorage.getItem('linksupply_wishlist') || '[]'),
    addresses: JSON.parse(localStorage.getItem('linksupply_addresses') || '[]'),
    unreadNotifications: 3
  };

  /* ==========================================================================
     2. UTILITY HELPERS
     ========================================================================== */
  const formatIDR = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number);
  };

  const saveCartToStorage = () => {
    localStorage.setItem('linksupply_cart', JSON.stringify(state.cart));
  };

  const saveWishlistToStorage = () => {
    localStorage.setItem('linksupply_wishlist', JSON.stringify(state.wishlist));
  };

  /* ==========================================================================
     3. TOAST NOTIFICATION SYSTEM
     ========================================================================== */
  const Toast = {
    container: null,

    init() {
      if (!this.container) {
        let container = document.getElementById('toastContainer');
        if (!container) {
          container = document.createElement('div');
          container.id = 'toastContainer';
          container.className = 'toast-container';
          document.body.appendChild(container);
        }
        this.container = container;
      }
    },

    show(message, type = 'success', icon = 'check_circle', duration = 3000) {
      this.init();

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      
      const iconClass = type === 'success' ? 'text-primary' : (type === 'warning' ? 'text-amber-500' : 'text-blue-500');

      toast.innerHTML = `
        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined ${iconClass} text-2xl shrink-0">${icon}</span>
          <div class="text-xs sm:text-sm font-medium text-gray-800 leading-snug">${message}</div>
        </div>
        <button class="text-gray-400 hover:text-gray-600 cursor-pointer p-1 shrink-0" aria-label="Tutup">
          <span class="material-symbols-outlined text-base">close</span>
        </button>
      `;

      const closeBtn = toast.querySelector('button');
      closeBtn.addEventListener('click', () => {
        this.dismiss(toast);
      });

      this.container.appendChild(toast);

      // Trigger reflow to animate
      requestAnimationFrame(() => {
        toast.classList.add('show');
      });

      const timer = setTimeout(() => {
        this.dismiss(toast);
      }, duration);

      toast.dataset.timer = timer;
    },

    dismiss(toast) {
      if (!toast || !toast.parentNode) return;
      clearTimeout(toast.dataset.timer);
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 350);
    }
  };

  /* ==========================================================================
     4. HERO SLIDER CONTROLLER
     ========================================================================== */
  const initSlider = () => {
    const slider = document.getElementById('adSlider');
    const wrapper = document.getElementById('sliderWrapper');
    const slides = wrapper ? wrapper.querySelectorAll('.slide-banner') : [];
    const prevBtn = document.getElementById('slidePrev');
    const nextBtn = document.getElementById('slideNext');
    const dotsContainer = document.getElementById('sliderDots');

    if (!slider || !wrapper || slides.length === 0) return;

    const totalSlides = slides.length;
    let currentIndex = 0;
    let autoSlideTimer = null;

    dotsContainer.innerHTML = '';
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('slider-dot');
      if (index === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Pindah ke slide ${index + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetAutoSlide();
      });
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.slider-dot');

    const updateSlider = () => {
      wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    };

    const goToSlide = (index) => {
      currentIndex = (index + totalSlides) % totalSlides;
      updateSlider();
    };

    const nextSlide = () => goToSlide(currentIndex + 1);
    const prevSlide = () => goToSlide(currentIndex - 1);

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
      });
    }

    const startAutoSlide = () => {
      stopAutoSlide();
      autoSlideTimer = setInterval(nextSlide, 5000);
    };

    const stopAutoSlide = () => {
      if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
        autoSlideTimer = null;
      }
    };

    const resetAutoSlide = () => {
      stopAutoSlide();
      startAutoSlide();
    };

    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);

    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoSlide();
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        nextSlide();
      } else if (touchEndX - touchStartX > 50) {
        prevSlide();
      }
      startAutoSlide();
    }, { passive: true });

    startAutoSlide();

    // Banner CTA buttons link to product category or action
    const bannerBtns = slider.querySelectorAll('.btn-ad');
    bannerBtns.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        const categories = ['all', 'all', 'perikanan', 'pertanian', 'all'];
        const targetCategory = categories[idx] || 'all';
        setCategoryFilter(targetCategory);
        document.getElementById('productGrid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        Toast.show(`Menampilkan promo & katalog pilihan`, 'info', 'local_offer');
      });
    });
  };

  /* ==========================================================================
     5. PRODUCT CATALOG RENDERER & FILTERS
     ========================================================================== */
  const renderProducts = () => {
    const productGrid = document.getElementById('productGrid');
    const productCountEl = document.querySelector('.product-count span');
    const btnSeeAll = document.getElementById('btnSeeAll');

    if (!productGrid) return;

    if (state.productsLoading) {
      if (productCountEl) productCountEl.textContent = 'Memuat produk...';
      productGrid.innerHTML = `
        <div class="col-span-full py-16 px-4 text-center text-sm text-gray-500" role="status">
          Memuat katalog produk...
        </div>
      `;
      return;
    }

    if (state.productsError) {
      if (productCountEl) productCountEl.textContent = '0 produk';
      productGrid.innerHTML = `
        <div class="col-span-full py-16 px-4 text-center bg-white border border-dashed border-gray-300 rounded-xl shadow-xs" role="alert">
          <span class="material-symbols-outlined text-6xl text-gray-300 mb-3 block">cloud_off</span>
          <h3 class="text-lg font-bold text-gray-800 mb-1">Katalog Gagal Dimuat</h3>
          <p class="text-sm text-gray-500">Periksa koneksi atau jalankan halaman melalui server lokal, lalu muat ulang.</p>
        </div>
      `;
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

    // Update product counter text
    if (productCountEl) {
      productCountEl.textContent = `${filtered.length} produk`;
    }

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
      const isFavorited = state.wishlist.includes(product.id);
      const isHidden = !state.isExpanded && index >= state.initialVisibleCount;

      const card = document.createElement('div');
      card.className = `product-card bg-white border border-border-custom rounded-lg overflow-hidden flex flex-col shadow-xs card-fade-in ${isHidden ? 'hidden-by-see-all' : ''}`;
      card.dataset.id = product.id;

      card.innerHTML = `
        <div class="card-img-wrap relative h-[145px] sm:h-[155px] w-full overflow-hidden bg-gray-100 cursor-pointer group/img" data-action="quickview" data-id="${product.id}">
          <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover" loading="lazy">
          <span class="absolute top-2.5 left-2.5 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded border ${product.badgeColor} shadow-xs backdrop-blur-xs">
            ${product.badge}
          </span>
          <button class="btn-fav absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-gray-400 hover:text-red-500 shadow-sm flex items-center justify-center cursor-pointer ${isFavorited ? 'favorited' : ''}" data-action="toggle-fav" data-id="${product.id}" aria-label="Favoritkan">
            <span class="material-symbols-outlined text-lg">${isFavorited ? 'favorite' : 'favorite'}</span>
          </button>
        </div>

        <div class="card-body p-3 sm:p-3.5 flex flex-col flex-1 gap-2">
          <div class="card-meta flex justify-between items-center text-[11px] sm:text-xs text-text-muted">
            <span class="flex items-center gap-1">
              <span class="material-symbols-outlined text-sm">location_on</span>
              <span class="truncate max-w-[120px]" title="${product.location}">${product.location.split(',')[0]}</span>
            </span>
            <span class="flex items-center gap-0.5 text-amber-500 font-semibold">
              <span class="material-symbols-outlined text-sm text-amber-400" style="font-variation-settings: 'FILL' 1;">star</span>
              ${product.rating}
            </span>
          </div>

          <h4 class="product-title font-bold text-gray-900 text-xs sm:text-sm line-clamp-2 hover:text-primary transition-colors cursor-pointer" data-action="quickview" data-id="${product.id}" title="${product.name}">
            ${product.name}
          </h4>

          <p class="text-[11px] text-gray-500 line-clamp-1">
            Min. Order: <strong class="text-gray-700 font-medium">${product.minOrder} ${product.minOrderUnit}</strong>
          </p>

          <div class="price-row flex justify-between items-end border-b border-dashed border-border-custom pb-2.5 mt-auto">
            <div>
              <div class="text-[10px] text-gray-500 font-medium">Harga Grosir</div>
              <div class="text-primary-dark font-extrabold text-sm sm:text-base">
                ${formatIDR(product.price)} <span class="text-[10px] text-gray-500 font-normal">/${product.priceUnit}</span>
              </div>
            </div>
            <div class="stock-info text-right">
              <div class="text-[10px] text-gray-400">Stok</div>
              <div class="text-xs font-semibold text-gray-700">${product.stock.toLocaleString('id-ID')} ${product.stockUnit}</div>
            </div>
          </div>

          <div class="card-actions grid grid-cols-2 gap-1.5 pt-1">
            <button class="btn-detail bg-white hover:bg-gray-50 text-text-main border border-border-custom text-xs font-semibold py-1.5 px-2 rounded-md transition-colors flex items-center justify-center gap-1 cursor-pointer" data-action="quickview" data-id="${product.id}">
              <span class="material-symbols-outlined text-sm">visibility</span>
              <span>Detail</span>
            </button>
            <button class="btn-add-cart bg-primary hover:bg-primary-dark active:scale-95 text-white text-xs font-semibold py-1.5 px-2 rounded-md transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer" data-action="add-cart" data-id="${product.id}">
              <span class="material-symbols-outlined text-sm">add_shopping_cart</span>
              <span>+ Keranjang</span>
            </button>
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
          textSpan.textContent = `Lihat Semua Produk (${filtered.length})`;
          iconSpan.textContent = 'expand_more';
        }
      } else {
        btnSeeAll.parentElement.style.display = 'none';
      }
    }
  };

  const escapeHtml = (unsafe) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const setCategoryFilter = (category) => {
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
     6. CART CONTROLLER & DRAWER
     ========================================================================== */
  const Cart = {
    drawer: null,
    badgeEl: null,

    init() {
      this.createDrawer();
      this.setupBadge();
      this.updateBadge();
    },

    setupBadge() {
      const cartIconWrap = document.querySelector('.icon-group span:last-child');
      if (cartIconWrap) {
        cartIconWrap.classList.add('relative', 'inline-flex');
        
        let badge = cartIconWrap.querySelector('.cart-badge');
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'cart-badge absolute -top-1.5 -right-2 bg-red-500 text-white text-[10px] font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center shadow-xs transition-transform duration-200';
          badge.style.display = 'none';
          cartIconWrap.appendChild(badge);
        }
        this.badgeEl = badge;

        cartIconWrap.addEventListener('click', () => {
          this.openDrawer();
        });
      }
    },

    updateBadge() {
      const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
      if (this.badgeEl) {
        if (totalCount > 0) {
          this.badgeEl.textContent = totalCount > 99 ? '99+' : totalCount;
          this.badgeEl.style.display = 'flex';
          this.badgeEl.classList.add('badge-pop');
          setTimeout(() => this.badgeEl.classList.remove('badge-pop'), 300);
        } else {
          this.badgeEl.style.display = 'none';
        }
      }
    },

    createDrawer() {
      let drawer = document.getElementById('cartDrawer');
      if (!drawer) {
        drawer = document.createElement('div');
        drawer.id = 'cartDrawer';
        drawer.className = 'fixed inset-0 z-50 overflow-hidden pointer-events-none transition-opacity duration-300 opacity-0';
        
        drawer.innerHTML = `
          <div class="drawer-backdrop absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"></div>
          <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div class="drawer-content w-screen max-w-md bg-white shadow-2xl flex flex-col transform translate-x-full">
              
              <!-- Header -->
              <div class="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary text-2xl">shopping_bag</span>
                  <h3 class="text-base sm:text-lg font-bold text-gray-900">Keranjang Belanja</h3>
                  <span class="cart-total-badge bg-emerald-100 text-primary-dark font-bold text-xs px-2 py-0.5 rounded-full">0</span>
                </div>
                <button class="btn-close-drawer text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" aria-label="Tutup Keranjang">
                  <span class="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              <!-- Cart Item List -->
              <div class="cart-items-container flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 custom-scrollbar">
                <!-- Injected dynamically -->
              </div>

              <!-- Footer / Checkout -->
              <div class="cart-footer p-4 sm:p-5 border-t border-gray-100 bg-gray-50/70 space-y-3">
                <div class="flex justify-between items-center text-sm">
                  <span class="text-gray-500 font-medium">Subtotal Produk</span>
                  <span class="cart-subtotal-price font-bold text-base text-gray-900">Rp 0</span>
                </div>
                <div class="text-[11px] text-gray-400">
                  * Biaya ongkir & asuransi kargo dihitung saat proses finalisasi checkout.
                </div>
                <button class="btn-checkout w-full bg-primary hover:bg-primary-dark active:scale-[0.99] text-white font-bold py-3 px-4 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer">
                  <span>Lanjut ke Pembayaran</span>
                  <span class="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
              </div>

            </div>
          </div>
        `;

        document.body.appendChild(drawer);

        // Drawer Close Actions
        const backdrop = drawer.querySelector('.drawer-backdrop');
        const closeBtn = drawer.querySelector('.btn-close-drawer');
        const checkoutBtn = drawer.querySelector('.btn-checkout');

        backdrop.addEventListener('click', () => this.closeDrawer());
        closeBtn.addEventListener('click', () => this.closeDrawer());

        checkoutBtn.addEventListener('click', () => {
          if (state.cart.length === 0) {
            Toast.show('Keranjang Anda masih kosong!', 'warning', 'production_quantity_limits');
            return;
          }
          window.location.href = 'payment.html';
        });
      }

      this.drawer = drawer;
    },

    openDrawer() {
      this.renderDrawerItems();
      this.drawer.classList.remove('pointer-events-none', 'opacity-0');
      this.drawer.classList.add('opacity-100');
      const content = this.drawer.querySelector('.drawer-content');
      if (content) {
        content.classList.remove('translate-x-full');
        content.classList.add('translate-x-0');
      }
      document.body.style.overflow = 'hidden';
    },

    closeDrawer() {
      const content = this.drawer.querySelector('.drawer-content');
      if (content) {
        content.classList.remove('translate-x-0');
        content.classList.add('translate-x-full');
      }
      this.drawer.classList.remove('opacity-100');
      this.drawer.classList.add('opacity-0', 'pointer-events-none');
      document.body.style.overflow = '';
    },

    renderDrawerItems() {
      const container = this.drawer.querySelector('.cart-items-container');
      const badgeTotal = this.drawer.querySelector('.cart-total-badge');
      const subtotalPriceEl = this.drawer.querySelector('.cart-subtotal-price');

      if (!container) return;

      const totalItems = state.cart.reduce((sum, item) => sum + item.quantity, 0);
      if (badgeTotal) badgeTotal.textContent = `${totalItems} item`;

      if (state.cart.length === 0) {
        container.innerHTML = `
          <div class="py-16 text-center">
            <span class="material-symbols-outlined text-6xl text-gray-300 mb-2">remove_shopping_cart</span>
            <h4 class="font-bold text-gray-800 mb-1">Keranjang Masih Kosong</h4>
            <p class="text-xs text-gray-500 mb-5">Belum ada komoditas atau pasokan yang Anda tambahkan.</p>
            <button class="btn-shop-now bg-primary hover:bg-primary-dark text-white text-xs font-semibold py-2 px-4 rounded-lg cursor-pointer transition-colors shadow-xs">
              Mulai Eksplor Produk
            </button>
          </div>
        `;

        const shopNowBtn = container.querySelector('.btn-shop-now');
        if (shopNowBtn) {
          shopNowBtn.addEventListener('click', () => {
            this.closeDrawer();
            document.getElementById('productGrid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          });
        }

        if (subtotalPriceEl) subtotalPriceEl.textContent = 'Rp 0';
        return;
      }

      let subtotal = 0;
      container.innerHTML = '';

      state.cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        const itemEl = document.createElement('div');
        itemEl.className = 'flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-xs';
        itemEl.innerHTML = `
          <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-100">
          <div class="flex-1 min-w-0">
            <h5 class="text-xs sm:text-sm font-bold text-gray-900 truncate" title="${item.name}">${item.name}</h5>
            <div class="text-[11px] text-gray-500 mb-1.5">${formatIDR(item.price)} / ${item.priceUnit}</div>
            
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                <button class="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-200 cursor-pointer text-xs" data-action="cart-minus" data-id="${item.id}">-</button>
                <span class="w-8 text-center text-xs font-bold text-gray-800">${item.quantity}</span>
                <button class="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-200 cursor-pointer text-xs" data-action="cart-plus" data-id="${item.id}">+</button>
              </div>

              <div class="font-extrabold text-xs sm:text-sm text-primary-dark">
                ${formatIDR(itemTotal)}
              </div>
            </div>
          </div>

          <button class="text-gray-300 hover:text-red-500 p-1.5 transition-colors cursor-pointer shrink-0" data-action="cart-remove" data-id="${item.id}" aria-label="Hapus Item">
            <span class="material-symbols-outlined text-lg">delete</span>
          </button>
        `;

        container.appendChild(itemEl);
      });

      if (subtotalPriceEl) {
        subtotalPriceEl.textContent = formatIDR(subtotal);
      }
    },

    addItem(productId, qtyToAdd = 1) {
      const product = state.products.find(p => p.id === Number(productId));
      if (!product) return;

      const existing = state.cart.find(item => item.id === product.id);
      const minOrder = product.minOrder || 1;

      if (existing) {
        existing.quantity += qtyToAdd;
      } else {
        const initialQty = qtyToAdd > 1 ? qtyToAdd : minOrder;
        state.cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          priceUnit: product.priceUnit,
          image: product.image,
          minOrder: minOrder,
          quantity: initialQty
        });
      }

      saveCartToStorage();
      this.updateBadge();
      Toast.show(`<strong>${product.name}</strong> ditambahkan ke keranjang!`, 'success', 'add_shopping_cart');
    },

    updateQuantity(productId, delta) {
      const item = state.cart.find(i => i.id === Number(productId));
      if (!item) return;

      item.quantity += delta;
      if (item.quantity <= 0) {
        this.removeItem(productId);
        return;
      }

      saveCartToStorage();
      this.updateBadge();
      this.renderDrawerItems();
    },

    removeItem(productId) {
      state.cart = state.cart.filter(i => i.id !== Number(productId));
      saveCartToStorage();
      this.updateBadge();
      this.renderDrawerItems();
      Toast.show('Item dihapus dari keranjang', 'info', 'remove_shopping_cart');
    }
  };

  const Profile = {
    drawer: null,

    init() {
      if (state.addresses.length === 0) {
        state.addresses = [
          {
            id: 'addr_1',
            label: 'Gudang Utama',
            recipient: 'Mitra Tani Sejahtera (Bpk. Joko)',
            phone: '+62 812-3456-7890',
            street: 'Jl. Raya Agrobisnis No. 45, RT 02 / RW 05',
            city: 'Cianjur',
            province: 'Jawa Barat',
            postalCode: '43211',
            isDefault: true
          }
        ];
        this.saveAddresses();
      }

      this.createDrawer();
      const profileBtn = document.getElementById('userProfileBtn');
      if (profileBtn) {
        profileBtn.addEventListener('click', () => {
          this.openDrawer();
        });
      }
    },

    saveAddresses() {
      localStorage.setItem('linksupply_addresses', JSON.stringify(state.addresses));
    },

    createDrawer() {
      let drawer = document.getElementById('profileDrawer');
      if (!drawer) {
        drawer = document.createElement('div');
        drawer.id = 'profileDrawer';
        drawer.className = 'fixed inset-0 z-50 overflow-hidden pointer-events-none transition-opacity duration-300 opacity-0';
        drawer.innerHTML = `
          <div class="drawer-backdrop absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300"></div>
          <div class="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div class="drawer-content w-screen max-w-md bg-white shadow-2xl flex flex-col transform translate-x-full">
              
              <div class="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-white">
                <div class="flex items-center gap-2.5">
                  <div class="w-9 h-9 rounded-full bg-emerald-100 text-primary-dark flex items-center justify-center font-bold text-sm border border-border-custom shadow-xs">
                    LS
                  </div>
                  <div>
                    <h3 class="text-base sm:text-lg font-bold text-gray-900 leading-tight">Profil Pengguna</h3>
                    <p class="text-xs text-text-muted">Kelola alamat & info akun</p>
                  </div>
                </div>
                <button class="btn-close-profile text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" aria-label="Tutup Profil">
                  <span class="material-symbols-outlined text-xl">close</span>
                </button>
              </div>

              <div class="profile-drawer-body flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 custom-scrollbar">
                
                <div class="p-3.5 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between">
                  <div>
                    <div class="text-xs text-gray-400 font-medium">Nama Akun</div>
                    <div class="font-bold text-gray-800 text-sm">Mitra Tani Sejahtera</div>
                    <div class="text-xs text-gray-500">mitratani@linksupply.id</div>
                  </div>
                  <span class="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Terverifikasi
                  </span>
                </div>

                <div>
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-1.5">
                      <span class="material-symbols-outlined text-primary text-xl">location_on</span>
                      <h4 class="font-bold text-gray-900 text-sm">Daftar Alamat</h4>
                    </div>
                    <button id="btnToggleAddAddress" class="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-dark cursor-pointer transition-colors bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg border border-border-custom">
                      <span class="material-symbols-outlined text-base">add</span>
                      <span>Tambah Alamat</span>
                    </button>
                  </div>

                  <form id="addressForm" class="hidden mb-4 p-4 bg-emerald-50/50 border border-border-custom rounded-xl space-y-3">
                    <div class="flex items-center justify-between border-b border-border-custom/50 pb-2">
                      <h5 class="text-xs font-bold text-primary-dark">Tambah Alamat Baru</h5>
                      <button type="button" id="btnCancelAddAddress" class="text-gray-400 hover:text-gray-600 text-xs cursor-pointer">
                        <span class="material-symbols-outlined text-base">close</span>
                      </button>
                    </div>

                    <div>
                      <label class="block text-[11px] font-semibold text-gray-700 mb-1">Label Alamat</label>
                      <input type="text" id="addrLabel" required placeholder="Contoh: Gudang Cabang, Kantor" class="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none bg-white focus:border-primary">
                    </div>

                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <label class="block text-[11px] font-semibold text-gray-700 mb-1">Nama Penerima / Kontak</label>
                        <input type="text" id="addrRecipient" required placeholder="Bpk. Joko" class="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none bg-white focus:border-primary">
                      </div>
                      <div>
                        <label class="block text-[11px] font-semibold text-gray-700 mb-1">Nomor Telepon</label>
                        <input type="tel" id="addrPhone" required placeholder="081234567890" class="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none bg-white focus:border-primary">
                      </div>
                    </div>

                    <div>
                      <label class="block text-[11px] font-semibold text-gray-700 mb-1">Alamat Lengkap</label>
                      <textarea id="addrStreet" required rows="2" placeholder="Nama jalan, nomor gudang/bangunan, RT/RW" class="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none bg-white focus:border-primary"></textarea>
                    </div>

                    <div class="grid grid-cols-3 gap-2">
                      <div>
                        <label class="block text-[11px] font-semibold text-gray-700 mb-1">Kota / Kab</label>
                        <input type="text" id="addrCity" required placeholder="Surabaya" class="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none bg-white focus:border-primary">
                      </div>
                      <div>
                        <label class="block text-[11px] font-semibold text-gray-700 mb-1">Provinsi</label>
                        <input type="text" id="addrProvince" required placeholder="Jawa Timur" class="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none bg-white focus:border-primary">
                      </div>
                      <div>
                        <label class="block text-[11px] font-semibold text-gray-700 mb-1">Kode Pos</label>
                        <input type="text" id="addrPostalCode" placeholder="60111" class="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg outline-none bg-white focus:border-primary">
                      </div>
                    </div>

                    <div class="flex items-center gap-2 pt-1">
                      <input type="checkbox" id="addrIsDefault" class="rounded text-primary focus:ring-primary h-4 w-4">
                      <label for="addrIsDefault" class="text-xs text-gray-700 cursor-pointer select-none">Jadikan sebagai alamat utama</label>
                    </div>

                    <div class="pt-2 flex justify-end gap-2">
                      <button type="button" id="btnCancelAddAddress2" class="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-50 cursor-pointer">
                        Batal
                      </button>
                      <button type="submit" class="px-4 py-1.5 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer transition-colors">
                        Simpan Alamat
                      </button>
                    </div>
                  </form>

                  <div id="addressList" class="space-y-3"></div>
                </div>

              </div>
            </div>
          </div>
        `;

        document.body.appendChild(drawer);

        const backdrop = drawer.querySelector('.drawer-backdrop');
        const closeBtn = drawer.querySelector('.btn-close-profile');

        backdrop.addEventListener('click', () => this.closeDrawer());
        closeBtn.addEventListener('click', () => this.closeDrawer());

        const toggleBtn = drawer.querySelector('#btnToggleAddAddress');
        const form = drawer.querySelector('#addressForm');
        const cancelBtn = drawer.querySelector('#btnCancelAddAddress');
        const cancelBtn2 = drawer.querySelector('#btnCancelAddAddress2');

        const toggleForm = (show) => {
          if (show) {
            form.classList.remove('hidden');
            toggleBtn.classList.add('hidden');
          } else {
            form.classList.add('hidden');
            toggleBtn.classList.remove('hidden');
            form.reset();
          }
        };

        toggleBtn.addEventListener('click', () => toggleForm(true));
        cancelBtn.addEventListener('click', () => toggleForm(false));
        cancelBtn2.addEventListener('click', () => toggleForm(false));

        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const newAddress = {
            id: 'addr_' + Date.now(),
            label: drawer.querySelector('#addrLabel').value.trim(),
            recipient: drawer.querySelector('#addrRecipient').value.trim(),
            phone: drawer.querySelector('#addrPhone').value.trim(),
            street: drawer.querySelector('#addrStreet').value.trim(),
            city: drawer.querySelector('#addrCity').value.trim(),
            province: drawer.querySelector('#addrProvince').value.trim(),
            postalCode: drawer.querySelector('#addrPostalCode').value.trim(),
            isDefault: drawer.querySelector('#addrIsDefault').checked
          };

          if (newAddress.isDefault) {
            state.addresses.forEach(a => a.isDefault = false);
          } else if (state.addresses.length === 0) {
            newAddress.isDefault = true;
          }

          state.addresses.unshift(newAddress);
          this.saveAddresses();
          this.renderAddresses();
          toggleForm(false);
          Toast.show('Alamat baru berhasil disimpan!', 'success', 'check_circle');
        });

        const addressListEl = drawer.querySelector('#addressList');
        addressListEl.addEventListener('click', (e) => {
          const setDefBtn = e.target.closest('[data-action="set-default-addr"]');
          if (setDefBtn) {
            this.setDefault(setDefBtn.dataset.id);
            return;
          }
          const delBtn = e.target.closest('[data-action="delete-addr"]');
          if (delBtn) {
            this.deleteAddress(delBtn.dataset.id);
            return;
          }
        });
      }

      this.drawer = drawer;
    },

    openDrawer() {
      this.renderAddresses();
      this.drawer.classList.remove('pointer-events-none', 'opacity-0');
      this.drawer.classList.add('opacity-100');
      const content = this.drawer.querySelector('.drawer-content');
      if (content) {
        content.classList.remove('translate-x-full');
        content.classList.add('translate-x-0');
      }
      document.body.style.overflow = 'hidden';
    },

    closeDrawer() {
      const content = this.drawer.querySelector('.drawer-content');
      if (content) {
        content.classList.remove('translate-x-0');
        content.classList.add('translate-x-full');
      }
      this.drawer.classList.remove('opacity-100');
      this.drawer.classList.add('opacity-0', 'pointer-events-none');
      document.body.style.overflow = '';
    },

    renderAddresses() {
      const listEl = this.drawer.querySelector('#addressList');
      if (!listEl) return;

      if (state.addresses.length === 0) {
        listEl.innerHTML = `
          <div class="p-6 text-center bg-gray-50 border border-dashed border-gray-300 rounded-xl">
            <span class="material-symbols-outlined text-4xl text-gray-300 mb-1">location_off</span>
            <p class="text-xs text-gray-500 font-medium">Belum ada alamat yang tersimpan.</p>
          </div>
        `;
        return;
      }

      listEl.innerHTML = state.addresses.map((addr) => `
        <div class="p-3.5 bg-white border ${addr.isDefault ? 'border-primary ring-1 ring-primary/20 bg-emerald-50/20' : 'border-gray-200'} rounded-xl relative hover:border-border-custom transition-all shadow-2xs">
          <div class="flex items-center justify-between mb-1.5">
            <div class="flex items-center gap-2">
              <span class="font-bold text-xs text-gray-900">${escapeHtml(addr.label)}</span>
              ${addr.isDefault ? '<span class="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">Utama</span>' : ''}
            </div>
            <div class="flex items-center gap-1">
              ${!addr.isDefault ? `
                <button class="text-[11px] font-semibold text-primary hover:underline px-1.5 py-0.5 cursor-pointer" data-action="set-default-addr" data-id="${addr.id}">
                  Set Utama
                </button>
              ` : ''}
              <button class="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer" data-action="delete-addr" data-id="${addr.id}" title="Hapus Alamat">
                <span class="material-symbols-outlined text-base">delete</span>
              </button>
            </div>
          </div>
          <div class="text-xs font-semibold text-gray-800 mb-0.5">${escapeHtml(addr.recipient)} <span class="text-gray-500 font-normal">(${escapeHtml(addr.phone)})</span></div>
          <div class="text-xs text-gray-600 leading-relaxed">${escapeHtml(addr.street)}</div>
          <div class="text-xs text-gray-500 mt-1">${escapeHtml(addr.city)}, ${escapeHtml(addr.province)}${addr.postalCode ? ' ' + escapeHtml(addr.postalCode) : ''}</div>
        </div>
      `).join('');
    },

    setDefault(id) {
      state.addresses.forEach(a => {
        a.isDefault = a.id === id;
      });
      this.saveAddresses();
      this.renderAddresses();
      Toast.show('Alamat utama berhasil diperbarui', 'info', 'check_circle');
    },

    deleteAddress(id) {
      const idx = state.addresses.findIndex(a => a.id === id);
      if (idx !== -1) {
        const wasDefault = state.addresses[idx].isDefault;
        state.addresses.splice(idx, 1);
        if (wasDefault && state.addresses.length > 0) {
          state.addresses[0].isDefault = true;
        }
        this.saveAddresses();
        this.renderAddresses();
        Toast.show('Alamat berhasil dihapus', 'info', 'delete');
      }
    }
  };

  /* ==========================================================================
     7. QUICK VIEW MODAL CONTROLLER
     ========================================================================== */
  const QuickView = {
    modal: null,
    currentProduct: null,
    selectedQty: 1,

    init() {
      this.createModal();
    },

    createModal() {
      let modal = document.getElementById('quickViewModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'quickViewModal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 pointer-events-none opacity-0 transition-opacity duration-300';
        
        modal.innerHTML = `
          <div class="modal-backdrop absolute inset-0 bg-black/60 backdrop-blur-xs"></div>
          
          <div class="modal-content relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden transform scale-95 opacity-0 transition-all duration-300 max-h-[90vh] flex flex-col">
            
            <button class="btn-close-modal absolute top-3.5 right-3.5 z-10 w-9 h-9 bg-white/80 hover:bg-white text-gray-500 hover:text-gray-900 rounded-full flex items-center justify-center shadow-md backdrop-blur-xs transition-colors cursor-pointer" aria-label="Tutup">
              <span class="material-symbols-outlined text-xl">close</span>
            </button>

            <div class="modal-body overflow-y-auto p-4 sm:p-6 custom-scrollbar flex-1">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                
                <!-- Image Side -->
                <div class="relative rounded-xl overflow-hidden bg-gray-100 aspect-4/3 md:aspect-square">
                  <img id="modalImg" src="" alt="" class="w-full h-full object-cover">
                  <span id="modalBadge" class="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded shadow-xs"></span>
                </div>

                <!-- Info Side -->
                <div class="flex flex-col">
                  <div class="flex items-center gap-1.5 text-xs text-text-muted mb-1">
                    <span class="material-symbols-outlined text-sm">location_on</span>
                    <span id="modalLocation"></span>
                  </div>

                  <h3 id="modalTitle" class="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 leading-snug"></h3>
                  
                  <div class="flex items-center gap-3 text-xs mb-3.5">
                    <div class="flex items-center gap-1 text-amber-500 font-bold">
                      <span class="material-symbols-outlined text-sm text-amber-400" style="font-variation-settings: 'FILL' 1;">star</span>
                      <span id="modalRating"></span>
                    </div>
                    <span class="text-gray-300">|</span>
                    <span id="modalSold" class="text-gray-500"></span>
                    <span class="text-gray-300">|</span>
                    <span class="text-emerald-700 font-semibold flex items-center gap-0.5">
                      <span class="material-symbols-outlined text-sm">verified</span> Terverifikasi
                    </span>
                  </div>

                  <div class="bg-gray-50 border border-gray-200/80 rounded-xl p-3 mb-4">
                    <div class="text-[11px] text-gray-500 font-medium mb-0.5">Harga Grosir Resmi</div>
                    <div class="text-primary-dark text-xl sm:text-2xl font-black">
                      <span id="modalPrice"></span>
                      <span id="modalUnit" class="text-xs text-gray-500 font-normal"></span>
                    </div>
                  </div>

                  <div class="text-xs text-gray-600 leading-relaxed mb-4" id="modalDesc"></div>

                  <div class="space-y-1.5 text-xs text-gray-600 border-t border-gray-100 pt-3 mb-4">
                    <div class="flex justify-between">
                      <span class="text-gray-500">Minimal Pemesanan:</span>
                      <strong id="modalMinOrder" class="text-gray-800"></strong>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-500">Ketersediaan Pasokan:</span>
                      <strong id="modalStock" class="text-gray-800"></strong>
                    </div>
                  </div>

                  <!-- Quantity selector & Add Button -->
                  <div class="mt-auto pt-2 space-y-3">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-bold text-gray-700">Jumlah Pesanan:</span>
                      <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-xs">
                        <button id="modalQtyMinus" class="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 cursor-pointer font-bold">-</button>
                        <input id="modalQtyInput" type="number" min="1" class="w-14 text-center text-xs font-bold text-gray-900 border-none outline-none" value="1">
                        <button id="modalQtyPlus" class="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 cursor-pointer font-bold">+</button>
                      </div>
                    </div>

                    <div class="flex gap-2">
                      <button id="modalBtnAddCart" class="flex-1 bg-primary hover:bg-primary-dark active:scale-[0.99] text-white text-xs sm:text-sm font-bold py-2.5 px-4 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer">
                        <span class="material-symbols-outlined text-lg">add_shopping_cart</span>
                        <span>Tambah ke Keranjang</span>
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        `;

        document.body.appendChild(modal);

        // Modal Events
        const backdrop = modal.querySelector('.modal-backdrop');
        const closeBtn = modal.querySelector('.btn-close-modal');
        const qtyMinus = modal.querySelector('#modalQtyMinus');
        const qtyPlus = modal.querySelector('#modalQtyPlus');
        const qtyInput = modal.querySelector('#modalQtyInput');
        const btnAddCart = modal.querySelector('#modalBtnAddCart');

        backdrop.addEventListener('click', () => this.close());
        closeBtn.addEventListener('click', () => this.close());

        qtyMinus.addEventListener('click', () => {
          const min = this.currentProduct ? this.currentProduct.minOrder : 1;
          if (this.selectedQty > min) {
            this.selectedQty -= 1;
            qtyInput.value = this.selectedQty;
          }
        });

        qtyPlus.addEventListener('click', () => {
          this.selectedQty += 1;
          qtyInput.value = this.selectedQty;
        });

        qtyInput.addEventListener('change', (e) => {
          const val = parseInt(e.target.value, 10);
          const min = this.currentProduct ? this.currentProduct.minOrder : 1;
          this.selectedQty = (!isNaN(val) && val >= min) ? val : min;
          qtyInput.value = this.selectedQty;
        });

        btnAddCart.addEventListener('click', () => {
          if (this.currentProduct) {
            Cart.addItem(this.currentProduct.id, this.selectedQty);
            this.close();
          }
        });
      }

      this.modal = modal;
    },

    open(productId) {
      const product = state.products.find(p => p.id === Number(productId));
      if (!product) return;

      this.currentProduct = product;
      this.selectedQty = product.minOrder;

      // Populate Modal Fields
      const img = this.modal.querySelector('#modalImg');
      const badge = this.modal.querySelector('#modalBadge');
      const location = this.modal.querySelector('#modalLocation');
      const title = this.modal.querySelector('#modalTitle');
      const rating = this.modal.querySelector('#modalRating');
      const sold = this.modal.querySelector('#modalSold');
      const price = this.modal.querySelector('#modalPrice');
      const unit = this.modal.querySelector('#modalUnit');
      const desc = this.modal.querySelector('#modalDesc');
      const minOrder = this.modal.querySelector('#modalMinOrder');
      const stock = this.modal.querySelector('#modalStock');
      const qtyInput = this.modal.querySelector('#modalQtyInput');

      img.src = product.image;
      img.alt = product.name;
      badge.textContent = product.badge;
      badge.className = `absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded shadow-xs ${product.badgeColor}`;
      location.textContent = product.location;
      title.textContent = product.name;
      rating.textContent = product.rating;
      sold.textContent = `Terjual ${product.soldCount}`;
      price.textContent = formatIDR(product.price);
      unit.textContent = ` / ${product.priceUnit}`;
      desc.textContent = product.desc;
      minOrder.textContent = `${product.minOrder} ${product.minOrderUnit}`;
      stock.textContent = `${product.stock.toLocaleString('id-ID')} ${product.stockUnit}`;
      qtyInput.value = this.selectedQty;

      // Animate Modal In
      this.modal.classList.remove('pointer-events-none', 'opacity-0');
      this.modal.classList.add('opacity-100');
      const content = this.modal.querySelector('.modal-content');
      if (content) {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
      }
      document.body.style.overflow = 'hidden';
    },

    close() {
      const content = this.modal.querySelector('.modal-content');
      if (content) {
        content.classList.remove('scale-100', 'opacity-100');
        content.classList.add('scale-95', 'opacity-0');
      }
      this.modal.classList.remove('opacity-100');
      this.modal.classList.add('opacity-0', 'pointer-events-none');
      document.body.style.overflow = '';
    }
  };

  /* ==========================================================================
     8. NOTIFICATION PANEL
     ========================================================================== */
  const initNotifications = () => {
    const notifBtn = document.querySelector('.icon-group span:first-child');
    if (!notifBtn) return;

    notifBtn.classList.add('relative', 'inline-flex');
    
    // Add badge
    const badge = document.createElement('span');
    badge.className = 'notif-badge absolute -top-1.5 -right-2 bg-amber-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-xs';
    badge.textContent = `${state.unreadNotifications}`;
    notifBtn.appendChild(badge);

    // Create dropdown panel
    const panel = document.createElement('div');
    panel.className = 'notif-panel fixed md:absolute top-16 right-4 sm:right-6 md:right-24 w-80 sm:w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 z-50 hidden card-fade-in';
    panel.innerHTML = `
      <div class="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
        <div class="flex items-center gap-1.5">
          <span class="material-symbols-outlined text-primary text-xl">notifications</span>
          <span class="font-bold text-sm text-gray-800">Notifikasi</span>
        </div>
        <button id="btnMarkRead" class="text-xs text-primary hover:text-primary-dark font-medium cursor-pointer">
          Tandai dibaca
        </button>
      </div>
      <div class="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar">
        <div class="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 flex items-start gap-2.5">
          <span class="material-symbols-outlined text-primary text-lg shrink-0 mt-0.5">local_offer</span>
          <div class="text-xs">
            <div class="font-bold text-gray-800">Flash Sale Panen Raya!</div>
            <div class="text-gray-600">Diskon hingga 50% untuk komoditas beras & sayuran segar.</div>
            <div class="text-[10px] text-gray-400 mt-1">10 menit yang lalu</div>
          </div>
        </div>
        <div class="p-2.5 rounded-lg bg-gray-50 border border-gray-100 flex items-start gap-2.5">
          <span class="material-symbols-outlined text-blue-500 text-lg shrink-0 mt-0.5">local_shipping</span>
          <div class="text-xs">
            <div class="font-bold text-gray-800">Pengiriman Jawa Timur Gratis</div>
            <div class="text-gray-600">Promo gratis ongkir untuk pemesanan minimal 500kg.</div>
            <div class="text-[10px] text-gray-400 mt-1">2 jam yang lalu</div>
          </div>
        </div>
        <div class="p-2.5 rounded-lg bg-gray-50 border border-gray-100 flex items-start gap-2.5">
          <span class="material-symbols-outlined text-amber-500 text-lg shrink-0 mt-0.5">inventory</span>
          <div class="text-xs">
            <div class="font-bold text-gray-800">Pasokan Baru Perikanan</div>
            <div class="text-gray-600">Koperasi Nelayan Pantura menambahkan 10 ton pasokan ikan segar.</div>
            <div class="text-[10px] text-gray-400 mt-1">Kemarin</div>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(panel);

    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = panel.classList.toggle('hidden');
      if (!isHidden) {
        // Position panel correctly on desktop
        const rect = notifBtn.getBoundingClientRect();
        panel.style.top = `${rect.bottom + 12}px`;
        panel.style.right = `${Math.max(16, window.innerWidth - rect.right - 20)}px`;
      }
    });

    const btnMarkRead = panel.querySelector('#btnMarkRead');
    btnMarkRead.addEventListener('click', () => {
      badge.style.display = 'none';
      state.unreadNotifications = 0;
      Toast.show('Semua notifikasi telah ditandai dibaca', 'info', 'done_all');
      panel.classList.add('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!panel.contains(e.target) && !notifBtn.contains(e.target)) {
        panel.classList.add('hidden');
      }
    });
  };

  /* ==========================================================================
     9. LOCATION SELECTOR
     ========================================================================== */
  const initLocationSelector = () => {
    const locBtn = document.querySelector('.location');
    if (!locBtn) return;

    locBtn.classList.add('cursor-pointer', 'hover:text-primary', 'transition-colors');

    const dropdown = document.createElement('div');
    dropdown.className = 'loc-dropdown fixed bg-white border border-gray-200 rounded-xl shadow-xl py-2 px-1 z-50 hidden card-fade-in w-48';
    dropdown.innerHTML = `
      <div class="text-[11px] font-bold text-gray-400 px-3 py-1 uppercase tracking-wider">Pilih Wilayah</div>
      <button class="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-emerald-50 hover:text-primary rounded-md font-medium cursor-pointer" data-loc="all">Semua Wilayah</button>
      <button class="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-emerald-50 hover:text-primary rounded-md font-medium cursor-pointer" data-loc="Jawa Timur">Jawa Timur</button>
      <button class="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-emerald-50 hover:text-primary rounded-md font-medium cursor-pointer" data-loc="Jawa Tengah">Jawa Tengah</button>
      <button class="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-emerald-50 hover:text-primary rounded-md font-medium cursor-pointer" data-loc="Jawa Barat">Jawa Barat</button>
    `;

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

    dropdown.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const loc = btn.dataset.loc;
        state.currentLocation = loc;
        const locLabel = locBtn.querySelector('span:last-child');
        if (locLabel) {
          locLabel.textContent = loc === 'all' ? 'Lokasi' : loc;
        }
        dropdown.classList.add('hidden');
        renderProducts();
        Toast.show(`Menampilkan pasokan wilayah: <strong>${loc === 'all' ? 'Semua Wilayah' : loc}</strong>`, 'info', 'location_on');
      });
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && !locBtn.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });
  };

  /* ==========================================================================
     10. BACK TO TOP BUTTON
     ========================================================================== */
  const initBackToTop = () => {
    let btn = document.getElementById('btnBackToTop');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'btnBackToTop';
      btn.className = 'fixed bottom-6 right-6 w-11 h-11 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg flex items-center justify-center z-40 hidden-btn cursor-pointer';
      btn.setAttribute('aria-label', 'Kembali ke atas');
      btn.innerHTML = '<span class="material-symbols-outlined text-2xl">arrow_upward</span>';
      document.body.appendChild(btn);
    }

    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        btn.classList.remove('hidden-btn');
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
        btn.classList.add('hidden-btn');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

      const handleSearch = () => {
        state.searchQuery = searchInput.value;
        if (searchInput.value.trim().length > 0) {
          clearBtn.classList.remove('hidden');
        } else {
          clearBtn.classList.add('hidden');
        }
        renderProducts();
      };

      // Live search input
      let debounceTimer = null;
      searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(handleSearch, 200);
      });

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
      const pills = pillsContainer.querySelectorAll('.pill');
      pills.forEach(pill => {
        pill.addEventListener('click', (e) => {
          e.preventDefault();
          const cat = pill.dataset.category || 'all';
          setCategoryFilter(cat);
        });
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

  /* ==========================================================================
     12. GLOBAL EVENT DELEGATION
     ========================================================================== */
  const initGlobalEvents = () => {
    // Delegated product card actions
    document.addEventListener('click', (e) => {
      // Toggle Wishlist / Favorite
      const favBtn = e.target.closest('[data-action="toggle-fav"]');
      if (favBtn) {
        e.stopPropagation();
        const id = Number(favBtn.dataset.id);
        const index = state.wishlist.indexOf(id);
        const isFavorited = index !== -1;

        if (isFavorited) {
          state.wishlist.splice(index, 1);
          favBtn.classList.remove('favorited');
          Toast.show('Dihapus dari daftar favorit', 'info', 'favorite_border');
        } else {
          state.wishlist.push(id);
          favBtn.classList.add('favorited');
          Toast.show('Ditambahkan ke daftar favorit!', 'success', 'favorite');
        }
        saveWishlistToStorage();
        return;
      }

      // Add To Cart from Card
      const addCartBtn = e.target.closest('[data-action="add-cart"]');
      if (addCartBtn) {
        e.stopPropagation();
        const id = Number(addCartBtn.dataset.id);
        Cart.addItem(id, 1);
        return;
      }

      // Quick View Modal Trigger
      const quickViewEl = e.target.closest('[data-action="quickview"]');
      if (quickViewEl) {
        e.stopPropagation();
        const id = Number(quickViewEl.dataset.id);
        QuickView.open(id);
        return;
      }

      // Cart Drawer Quantity Controls
      const cartPlus = e.target.closest('[data-action="cart-plus"]');
      if (cartPlus) {
        Cart.updateQuantity(cartPlus.dataset.id, 1);
        return;
      }

      const cartMinus = e.target.closest('[data-action="cart-minus"]');
      if (cartMinus) {
        Cart.updateQuantity(cartMinus.dataset.id, -1);
        return;
      }

      const cartRemove = e.target.closest('[data-action="cart-remove"]');
      if (cartRemove) {
        Cart.removeItem(cartRemove.dataset.id);
        return;
      }
    });

    // Keyboard ESC to close modal or drawer
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        QuickView.close();
        Cart.closeDrawer();
        Profile.closeDrawer();
      }
    });

    // Newsletter Subscription Form
    const newsletterForm = document.querySelector('.footer__newsletter__form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        if (emailInput && emailInput.value) {
          Toast.show(`Terima kasih! Email <strong>${escapeHtml(emailInput.value)}</strong> berhasil didaftarkan untuk promo spesial.`, 'success', 'mark_email_read');
          emailInput.value = '';
        }
      });
    }
  };

  /* ==========================================================================
     13. APPLICATION INITIALIZATION
     ========================================================================== */
  const loadProducts = async () => {
    try {
      const response = await fetch('./js/product.json');
      if (!response.ok) {
        throw new Error(`Product dataset request failed with status ${response.status}`);
      }

      const products = await response.json();
      if (!Array.isArray(products)) {
        throw new Error('Product dataset must be a JSON array');
      }

      state.products = products;
      state.filteredProducts = [...products];
      state.productsLoading = false;
      renderProducts();
    } catch (error) {
      console.error('Unable to load the product dataset.', error);
      state.productsLoading = false;
      state.productsError = true;
      renderProducts();
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    Toast.init();
    initSlider();
    initSearchAndSort();
    Cart.init();
    Profile.init();
    QuickView.init();
    initNotifications();
    initLocationSelector();
    initBackToTop();
    initGlobalEvents();
    loadProducts();
  });

})();
