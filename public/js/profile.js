import { state, escapeHtml } from './core.js';
import { Toast } from './toast.js';

export const Profile = {
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
