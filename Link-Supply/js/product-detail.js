import { state, formatIDR } from './core.js';
import { Cart } from './cart.js';

/* ==========================================================================
     7. QUICK VIEW MODAL CONTROLLER
     ========================================================================== */
export const QuickView = {
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
