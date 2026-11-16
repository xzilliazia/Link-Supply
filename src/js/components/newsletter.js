import { requireEl } from '../utils/dom.js';
import { escapeHtml } from '../utils/format.js';
import { showToast } from './toast.js';

export const initNewsletter = () => {
  const form = requireEl('newsletterForm');
  const emailInput = requireEl('newsletterEmail');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!emailInput.value) return;
    showToast(
      `Terima kasih! Email <strong>${escapeHtml(emailInput.value)}</strong> berhasil didaftarkan untuk promo spesial.`,
      'success',
      'mark_email_read',
    );
    emailInput.value = '';
  });
};
