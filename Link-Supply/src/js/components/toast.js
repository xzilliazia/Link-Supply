import { TOAST } from '../config.js';

const ICON_COLOR = {
  success: 'text-primary',
  warning: 'text-amber-500',
  info: 'text-blue-500',
};

let container = null;

const getContainer = () => {
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
};

/**
 * Tampilkan notifikasi singkat.
 * `message` diperlakukan sebagai HTML (boleh <strong>) — escapeHtml() dulu jika berisi input pengguna.
 */
export const showToast = (message, type = 'success', icon = 'check_circle') => {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="flex items-center gap-3">
      <span class="material-symbols-outlined ${ICON_COLOR[type] ?? ICON_COLOR.info} text-2xl shrink-0">${icon}</span>
      <div class="text-xs sm:text-sm font-medium text-gray-800 leading-snug">${message}</div>
    </div>
    <button type="button" class="text-gray-400 hover:text-gray-600 cursor-pointer p-1 shrink-0" aria-label="Tutup">
      <span class="material-symbols-outlined text-base">close</span>
    </button>
  `;

  const timer = setTimeout(dismiss, TOAST.durationMs);

  function dismiss() {
    clearTimeout(timer);
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), TOAST.exitMs);
  }

  toast.querySelector('button').addEventListener('click', dismiss);
  getContainer().appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
};
