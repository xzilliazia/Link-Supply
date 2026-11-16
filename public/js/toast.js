/* ==========================================================================
     3. TOAST NOTIFICATION SYSTEM
     ========================================================================== */
  export const Toast = {
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
