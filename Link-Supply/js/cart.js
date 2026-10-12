import { state, formatIDR, saveCartToStorage, escapeHtml } from './core.js';
import { Toast } from './toast.js';

/* ==========================================================================
     6. CART CONTROLLER & DRAWER
     ========================================================================== */
export const Cart = {
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
      Toast.show(`<strong>${escapeHtml(product.name)}</strong> ditambahkan ke keranjang!`, 'success', 'add_shopping_cart');
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
