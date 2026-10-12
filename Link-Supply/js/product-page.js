import './image-loading.js';
import { state, formatIDR } from './core.js';
import { Cart } from './cart.js';
import { Toast } from './toast.js';

const initProductPage = () => {
  const product = window.LINKSUPPLY_PRODUCT;
  const container = document.getElementById('productDetail');
  if (!product || !container) return;

  state.products = [...state.products.filter(item => item.id !== product.id), product];

  const minPurchase = product.minOrder;
  const isAvailable = product.stock > 0;
  const quantityInputs = [...container.querySelectorAll('[data-quantity-input]')];

  const updateQuantity = input => {
    if (!isAvailable) {
      quantityInputs.forEach(quantityInput => { quantityInput.value = '0'; });
      container.querySelectorAll('[data-subtotal]').forEach(subtotal => { subtotal.textContent = formatIDR(0); });
      return 0;
    }

    const parsedQuantity = Number.parseInt(input.value, 10);
    const quantity = Math.min(
      product.stock,
      Math.max(minPurchase, Number.isFinite(parsedQuantity) ? parsedQuantity : minPurchase)
    );
    quantityInputs.forEach(quantityInput => { quantityInput.value = String(quantity); });
    container.querySelectorAll('[data-subtotal]').forEach(subtotal => {
      subtotal.textContent = formatIDR(product.price * quantity);
    });
    container.querySelectorAll('[data-quantity-step="-1"]').forEach(button => {
      button.disabled = quantity <= minPurchase;
    });
    container.querySelectorAll('[data-quantity-step="1"]').forEach(button => {
      button.disabled = quantity >= product.stock;
    });
    return quantity;
  };

  container.querySelectorAll('[data-quantity-input], [data-quantity-step], [data-add-to-cart], [data-buy-now]')
    .forEach(control => { control.disabled = !isAvailable; });

  container.querySelectorAll('[data-quantity-step]').forEach(button => {
    button.addEventListener('click', () => {
      const input = button.closest('.product-page__stepper').querySelector('[data-quantity-input]');
      input.value = String(Number(input.value) + Number(button.dataset.quantityStep));
      updateQuantity(input);
    });
  });

  quantityInputs.forEach(input => {
    input.addEventListener('change', () => updateQuantity(input));
    input.addEventListener('input', () => {
      const pairedInput = quantityInputs.find(otherInput => otherInput !== input);
      if (pairedInput) pairedInput.value = input.value;

      const quantity = Number.parseInt(input.value, 10);
      if (Number.isFinite(quantity) && quantity > product.stock) {
        updateQuantity(input);
        return;
      }
      if (Number.isFinite(quantity) && quantity >= minPurchase && quantity <= product.stock) {
        container.querySelectorAll('[data-subtotal]').forEach(subtotal => {
          subtotal.textContent = formatIDR(product.price * quantity);
        });
        container.querySelectorAll('[data-quantity-step="-1"]').forEach(button => {
          button.disabled = quantity <= minPurchase;
        });
        container.querySelectorAll('[data-quantity-step="1"]').forEach(button => {
          button.disabled = quantity >= product.stock;
        });
      }
    });
  });
  updateQuantity(quantityInputs[0]);

  container.querySelectorAll('[data-variant-id]').forEach(button => {
    button.addEventListener('click', () => {
      container.querySelectorAll('[data-variant-id]').forEach(option => {
        const selected = option === button;
        option.classList.toggle('is-selected', selected);
        option.setAttribute('aria-pressed', String(selected));
        option.querySelector('.material-symbols-outlined').textContent = selected
          ? 'check_circle'
          : 'radio_button_unchecked';
      });
    });
  });

  container.querySelectorAll('[data-gallery-index]').forEach(button => {
    button.addEventListener('click', () => {
      const selectedIndex = Number(button.dataset.galleryIndex);
      container.querySelectorAll('[data-gallery-index]').forEach(thumbnail => {
        const selected = thumbnail === button;
        thumbnail.classList.toggle('is-active', selected);
        thumbnail.setAttribute('aria-pressed', String(selected));
      });
      container.querySelectorAll('[data-gallery-image]').forEach(image => {
        image.classList.toggle('hidden', Number(image.dataset.galleryImage) !== selectedIndex);
      });
    });
  });

  container.querySelectorAll('[data-expand-title]').forEach(button => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') !== 'true';
      container.querySelector('#productTitle').classList.toggle('is-clamped', !expanded);
      button.setAttribute('aria-expanded', String(expanded));
      button.querySelector('.material-symbols-outlined').textContent = expanded ? 'expand_less' : 'expand_more';
    });
  });

  container.querySelector('[data-expand-description]').addEventListener('click', event => {
    const button = event.currentTarget;
    const expanded = button.getAttribute('aria-expanded') !== 'true';
    container.querySelector('[data-product-description]').classList.toggle('is-clamped', !expanded);
    button.setAttribute('aria-expanded', String(expanded));
    button.textContent = expanded ? 'Lihat lebih sedikit' : 'Lihat selengkapnya';
  });

  container.querySelector('[data-follow-seller]').addEventListener('click', event => {
    const button = event.currentTarget;
    const following = button.getAttribute('aria-pressed') !== 'true';
    button.setAttribute('aria-pressed', String(following));
    button.textContent = following ? 'Diikuti' : 'Ikuti';
  });

  const addToCart = () => {
    if (!isAvailable) {
      Toast.show('Stok produk sedang habis.', 'warning', 'production_quantity_limits');
      return;
    }
    Cart.addItem(product.id, updateQuantity(quantityInputs[0]));
  };

  container.querySelectorAll('[data-add-to-cart]').forEach(button => {
    button.addEventListener('click', addToCart);
  });
  container.querySelectorAll('[data-buy-now]').forEach(button => {
    button.addEventListener('click', () => {
      if (!isAvailable) return;
      addToCart();
      window.location.href = './payment.html';
    });
  });

  container.querySelectorAll('[data-product-action]').forEach(button => {
    button.addEventListener('click', async () => {
      if (button.dataset.productAction === 'chat') {
        Toast.show('Chat dengan pemasok akan segera tersedia.', 'info', 'chat');
        return;
      }
      if (button.dataset.productAction === 'wishlist') {
        try {
          const wishlist = JSON.parse(localStorage.getItem('linksupply_wishlist') || '[]');
          const saved = wishlist.includes(product.id);
          const updated = saved ? wishlist.filter(id => id !== product.id) : [...wishlist, product.id];
          localStorage.setItem('linksupply_wishlist', JSON.stringify(updated));
          button.setAttribute('aria-pressed', String(!saved));
          button.querySelector('.material-symbols-outlined').textContent = saved ? 'favorite_border' : 'favorite';
          Toast.show(saved ? 'Produk dihapus dari wishlist.' : 'Produk disimpan ke wishlist.', 'success', 'favorite');
        } catch (error) {
          console.error('Unable to update the wishlist.', error);
          Toast.show('Wishlist tidak dapat diperbarui.', 'error', 'error');
        }
        return;
      }

      try {
        if (navigator.share) {
          await navigator.share({ title: product.name, url: window.location.href });
        } else {
          await navigator.clipboard.writeText(window.location.href);
          Toast.show('Tautan produk berhasil disalin.', 'success', 'link');
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Unable to share the product.', error);
          Toast.show('Tautan produk tidak dapat dibagikan.', 'error', 'error');
        }
      }
    });
  });
};

document.addEventListener('DOMContentLoaded', initProductPage, { once: true });
