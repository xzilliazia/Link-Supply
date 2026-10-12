import { escapeHtml } from './core.js';
import { Toast } from './toast.js';
import { Cart } from './cart.js';
import { Profile } from './profile.js';
import { QuickView } from './product-detail.js';

  /* ==========================================================================
     12. GLOBAL EVENT DELEGATION
     ========================================================================== */
  export const initGlobalEvents = () => {
    // Delegated product card actions
    document.addEventListener('click', (e) => {
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
      const productCard = e.target.closest('.product-card[data-action="quickview"]');
      if (productCard && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        QuickView.open(productCard.dataset.id);
        return;
      }
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
