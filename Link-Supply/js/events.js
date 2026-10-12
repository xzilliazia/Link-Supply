import { escapeHtml } from './core.js';
import { Toast } from './toast.js';
import { Cart } from './cart.js';
import { Profile } from './profile.js';

  /* ==========================================================================
     12. GLOBAL EVENT DELEGATION
     ========================================================================== */
  export const initGlobalEvents = () => {
    // Delegated product card actions
    document.addEventListener('click', (e) => {
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

    // Keyboard ESC to close drawers
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
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
