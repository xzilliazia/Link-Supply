import './image-loading.js';
import { state, formatIDR, escapeHtml } from './core.js';
import { fetchApiData } from './api.js';
import { Cart } from './cart.js';
import { Toast } from './toast.js';
import { createProductPageData } from './product-detail-data.js';

const mockReviews = [
  { name: 'Rina Puspitasari', rating: 5, date: '12 Juni 2025', comment: 'Kualitas produk sesuai deskripsi, jumlah pas, dan pengiriman tertata rapi.' },
  { name: 'Budi Santoso', rating: 5, date: '28 Mei 2025', comment: 'Pasokan datang tepat waktu. Respons penjual cepat saat memastikan jadwal pengiriman.' },
  { name: 'Dewi Anggraini', rating: 4, date: '10 Mei 2025', comment: 'Kualitasnya baik dan konsisten untuk kebutuhan usaha. Akan memesan kembali.' }
];

const renderStars = rating => `
  <span class="product-page__stars" role="img" aria-label="${escapeHtml(String(rating))} dari 5 bintang">
    ${Array.from({ length: 5 }, (_, index) => `<span class="material-symbols-outlined" aria-hidden="true">${index < Math.round(Number(rating)) ? 'star' : 'star_outline'}</span>`).join('')}
  </span>
`;

const renderBreadcrumb = product => `
  <nav class="product-page__breadcrumb" aria-label="Breadcrumb">
    <a href="./index.html">Beranda</a>
    <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
    <a href="./index.html#productGrid">${escapeHtml(product.specs.category)}</a>
    <span class="material-symbols-outlined" aria-hidden="true">chevron_right</span>
    <span aria-current="page">${escapeHtml(product.title)}</span>
  </nav>
`;

const renderProductIllustration = (product, image, index, extraClass = '') => `
  <svg class="${extraClass}" viewBox="0 0 560 480" role="img" aria-label="${escapeHtml(image.alt)}" xmlns="http://www.w3.org/2000/svg">
    <title>${escapeHtml(image.alt)}</title>
    <rect x="24" y="24" width="512" height="432" rx="28" fill="var(--bg-muted)"/>
    <circle cx="${index === 1 ? 172 : 390}" cy="132" r="72" fill="var(--primary-light)" opacity=".28"/>
    <path d="M96 344 190 206l68 88 55-70 151 120v42H96z" fill="var(--primary-light)" opacity=".42"/>
    <path d="M156 280h248l-19 111H175z" rx="10" fill="var(--primary)"/>
    <path d="M174 268h211v36H174z" fill="var(--primary-dark)"/>
    <path d="M280 269c-29-25-18-58 4-78 4 31 23 41 13 67 23-22 45-19 61-13-27 10-33 28-50 42" fill="var(--bg-main)"/>
    <path d="M280 271c1-31 7-53 20-72" fill="none" stroke="var(--bg-main)" stroke-width="7" stroke-linecap="round"/>
    <circle cx="148" cy="144" r="8" fill="var(--primary)"/>
    <circle cx="420" cy="172" r="6" fill="var(--primary)"/>
    <path d="M210 340h140" stroke="var(--bg-main)" stroke-width="8" stroke-linecap="round" opacity=".75"/>
  </svg>
`;

const renderGallery = product => `
  <section class="product-page__gallery" aria-label="Galeri produk">
    <div class="product-page__gallery-main">
      ${renderProductIllustration(product, product.images[0], 0, 'product-page__illustration')}
      <span class="product-page__gallery-caption">Ilustrasi produk</span>
    </div>
    <div class="product-page__thumbnails" role="group" aria-label="Pilih ilustrasi produk">
      ${product.images.map((image, index) => `
        <button class="product-page__thumbnail${index === 0 ? ' is-active' : ''}" type="button" data-gallery-index="${index}" aria-label="Tampilkan ${escapeHtml(image.alt)}" aria-pressed="${index === 0}">
          ${renderProductIllustration(product, image, index, '')}
        </button>
      `).join('')}
    </div>
  </section>
`;

const renderVariantSelector = product => `
  <fieldset class="product-page__variant-selector">
    <legend>Pilihan pasokan <span>· Pilihan contoh</span></legend>
    <div class="product-page__variant-options">
      ${product.variants.map((variant, index) => `
        <button class="product-page__variant${index === 0 ? ' is-selected' : ''}" type="button" data-variant-id="${escapeHtml(variant.id)}" aria-pressed="${index === 0}">
          <span>${escapeHtml(variant.label)}</span>
          <span class="material-symbols-outlined" aria-hidden="true">${index === 0 ? 'check_circle' : 'radio_button_unchecked'}</span>
        </button>
      `).join('')}
    </div>
  </fieldset>
`;

const renderProductSummary = product => `
  <section class="product-page__summary" aria-label="Ringkasan produk">
    <div class="product-page__eyebrow">
      <span>${escapeHtml(product.specs.category)}</span>
      <span class="product-page__availability"><i></i>${product.stock > 0 ? 'Siap dipasok' : 'Stok habis'}</span>
    </div>
    <div class="product-page__title-row">
      <h1 id="productTitle" class="product-page__title is-clamped">${escapeHtml(product.title)}</h1>
      <button class="product-page__icon-button" type="button" data-expand-title aria-label="Tampilkan nama produk selengkapnya" aria-expanded="false">
        <span class="material-symbols-outlined" aria-hidden="true">expand_more</span>
      </button>
    </div>
    <div class="product-page__meta">
      <span>Terjual ${escapeHtml(product.sold)}</span>
      <span class="product-page__meta-separator" aria-hidden="true">·</span>
      <span class="product-page__rating">${renderStars(product.rating)} <strong>${escapeHtml(String(product.rating))}</strong></span>
      <a href="#productReviews">${product.ratingCount.toLocaleString('id-ID')} ulasan</a>
    </div>
    <div class="product-page__price-panel">
      <div class="product-page__price-line">
        <p class="product-page__price">${formatIDR(product.price)}<span> / ${escapeHtml(product.specs.unitWeight.replace(/^1 /, ''))}</span></p>
        <span class="product-page__discount">${product.discountPercent}% OFF</span>
      </div>
      <p class="product-page__original-price">${formatIDR(product.originalPrice)} <span>harga pembanding contoh</span></p>
      <p class="product-page__preview-note">Harga dan variasi merupakan data pratinjau.</p>
    </div>
    ${renderVariantSelector(product)}
    <section class="product-page__details" aria-labelledby="productDetailsHeading">
      <h2 id="productDetailsHeading">Informasi pasokan</h2>
      <dl>
        <div><dt>Kondisi</dt><dd>${escapeHtml(product.specs.condition)}</dd></div>
        <div><dt>Bobot satuan</dt><dd>${escapeHtml(product.specs.unitWeight)}</dd></div>
        <div><dt>Minimum pembelian</dt><dd>${escapeHtml(product.specs.minPurchase)}</dd></div>
        <div><dt>Kategori</dt><dd><a href="./index.html#productGrid">${escapeHtml(product.specs.category)}</a></dd></div>
        <div><dt>Showcase</dt><dd><a href="./index.html#productGrid">${escapeHtml(product.specs.showcase)}</a></dd></div>
      </dl>
      <p class="product-page__description is-clamped" data-product-description>${escapeHtml(product.description)}</p>
      <button class="product-page__text-button" type="button" data-expand-description aria-expanded="false">Lihat selengkapnya</button>
    </section>
    <div class="product-page__seller">
      <div class="product-page__seller-avatar" aria-hidden="true"><span class="material-symbols-outlined">storefront</span></div>
      <div class="product-page__seller-copy">
        <strong>${escapeHtml(product.seller.name)}</strong>
        <span class="product-page__seller-caption">Profil pemasok contoh</span>
        ${product.seller.verified ? '<span class="product-page__verified"><span class="material-symbols-outlined" aria-label="Penjual terverifikasi">verified</span> Terverifikasi · contoh</span>' : ''}
      </div>
      <button class="product-page__follow" type="button" data-follow-seller aria-pressed="false">Ikuti</button>
    </div>
  </section>
`;

const renderQuantityStepper = product => `
  <div class="product-page__stepper" role="group" aria-label="Jumlah pesanan">
    <button type="button" data-quantity-step="-1" aria-label="Kurangi jumlah">−</button>
    <input type="number" data-quantity-input min="${product.minPurchase}" max="${product.stock}" step="1" value="${product.minPurchase}" inputmode="numeric" aria-label="Jumlah ${escapeHtml(product.specs.unitWeight)}">
    <button type="button" data-quantity-step="1" aria-label="Tambah jumlah">+</button>
  </div>
`;

const renderPurchaseBox = product => `
  <aside class="product-page__purchase-box" aria-label="Beli produk">
    <div class="product-page__purchase-heading">
      <span class="material-symbols-outlined" aria-hidden="true">inventory_2</span>
      <h2>Pesan pasokan</h2>
    </div>
    <div class="product-page__stock"><span>Stok tersedia</span><strong>${product.stock.toLocaleString('id-ID')} ${escapeHtml(product.specs.unitWeight.replace(/^1 /, ''))}</strong></div>
    ${product.stock > 0 ? '' : '<p class="product-page__out-of-stock" role="status">Pasokan ini sedang habis. Silakan cek kembali nanti.</p>'}
    <div class="product-page__purchase-quantity">
      <span>Jumlah pesanan</span>
      ${renderQuantityStepper(product)}
    </div>
    <p class="product-page__minimum">Minimum ${escapeHtml(product.specs.minPurchase)}</p>
    <div class="product-page__subtotal">
      <span>Subtotal</span>
      <strong data-subtotal>${formatIDR(product.price * product.minPurchase)}</strong>
    </div>
    <button class="product-page__button" type="button" data-add-to-cart>
      <span class="material-symbols-outlined" aria-hidden="true">add_shopping_cart</span>
      Tambah ke Keranjang
    </button>
    <button class="product-page__button product-page__button--secondary" type="button" data-buy-now>Beli Sekarang</button>
    <div class="product-page__trust">
      <span><span class="material-symbols-outlined" aria-hidden="true">local_shipping</span>Detail pengiriman tersedia saat checkout</span>
      <span><span class="material-symbols-outlined" aria-hidden="true">lock</span>Metode pembayaran tersedia saat checkout</span>
    </div>
    <div class="product-page__secondary-actions">
      <button type="button" data-product-action="chat"><span class="material-symbols-outlined" aria-hidden="true">chat</span><span>Chat</span></button>
      <button type="button" data-product-action="wishlist" aria-pressed="false"><span class="material-symbols-outlined" aria-hidden="true">favorite_border</span><span>Wishlist</span></button>
      <button type="button" data-product-action="share"><span class="material-symbols-outlined" aria-hidden="true">share</span><span>Bagikan</span></button>
    </div>
  </aside>
`;

const renderMobilePurchaseBar = product => `
  <div class="product-page__mobile-bar" role="region" aria-label="Aksi pembelian cepat">
    <div class="product-page__mobile-bar-info">
      ${renderQuantityStepper(product)}
      <div><span>Subtotal</span><strong data-subtotal>${formatIDR(product.price * product.minPurchase)}</strong></div>
    </div>
    <div class="product-page__mobile-bar-actions">
      <button class="product-page__button product-page__button--secondary" type="button" data-buy-now>Beli</button>
      <button class="product-page__button" type="button" data-add-to-cart aria-label="Tambah ke keranjang">
        <span class="material-symbols-outlined" aria-hidden="true">add_shopping_cart</span>
      </button>
    </div>
  </div>
`;

const renderReviews = product => {
  const ratings = [5, 4, 3, 2, 1];
  const rows = ratings.map(stars => {
    const count = product.ratingDistribution[stars];
    return `
      <div class="product-page__rating-row">
        <span>${stars} bintang</span>
        <div role="img" aria-label="${stars} bintang, ${count} ulasan"><span style="width:${count / product.ratingCount * 100}%"></span></div>
        <span>${count}</span>
      </div>
    `;
  }).join('');
  const reviews = mockReviews.map(review => `
    <article class="product-page__review">
      <div><strong>${escapeHtml(review.name)}</strong>${renderStars(review.rating)}</div>
      <time>${escapeHtml(review.date)}</time>
      <p>${escapeHtml(review.comment)}</p>
    </article>
  `).join('');

  return `
    <section class="product-page__reviews" id="productReviews" aria-labelledby="reviewsHeading" aria-describedby="reviewsNotice">
      <div class="product-page__section-heading">
        <div><span class="product-page__section-kicker">Suara mitra</span><h2 id="reviewsHeading">Rating &amp; ulasan</h2></div>
        <p id="reviewsNotice">Contoh ulasan untuk pratinjau, bukan ulasan pelanggan terverifikasi.</p>
      </div>
      <div class="product-page__review-overview">
        <div class="product-page__review-score"><strong>${Number(product.rating).toFixed(1)}</strong>${renderStars(product.rating)}<span>${product.ratingCount.toLocaleString('id-ID')} ulasan contoh</span></div>
        <div class="product-page__rating-bars">${rows}</div>
      </div>
      <div class="product-page__review-list">${reviews}</div>
    </section>
  `;
};

const renderError = message => {
  const container = document.getElementById('productDetail');
  container.classList.add('product-page__error-state');
  container.innerHTML = `
    <div class="product-page__message" role="alert">
      <span class="material-symbols-outlined" aria-hidden="true">cloud_off</span>
      <h1>Produk tidak dapat dimuat</h1>
      <p>${escapeHtml(message)}</p>
      <button class="product-page__button" id="retryProduct" type="button">Coba Lagi</button>
    </div>
  `;
  container.querySelector('#retryProduct').addEventListener('click', () => window.location.reload());
};

const renderProduct = product => {
  const container = document.getElementById('productDetail');
  document.title = `${product.title} | LinkSupply`;
  container.className = 'product-page__container product-page__content';
  container.innerHTML = `
    ${renderBreadcrumb(product)}
    <div class="product-page__layout">
      ${renderGallery(product)}
      ${renderProductSummary(product)}
      ${renderPurchaseBox(product)}
    </div>
    ${renderReviews(product)}
    ${renderMobilePurchaseBar(product)}
  `;

  const isAvailable = product.stock > 0;
  container.querySelectorAll('[data-quantity-input], [data-quantity-step], [data-add-to-cart], [data-buy-now]').forEach(control => {
    control.disabled = !isAvailable;
  });

  const normalizeQuantity = input => {
    if (!isAvailable) {
      container.querySelectorAll('[data-quantity-input]').forEach(quantityInput => { quantityInput.value = '0'; });
      container.querySelectorAll('[data-subtotal]').forEach(subtotal => { subtotal.textContent = formatIDR(0); });
      return 0;
    }
    const quantity = Number.parseInt(input.value, 10);
    const value = Math.min(product.stock, Math.max(product.minPurchase, Number.isFinite(quantity) ? quantity : product.minPurchase));
    container.querySelectorAll('[data-quantity-input]').forEach(quantityInput => { quantityInput.value = String(value); });
    container.querySelectorAll('[data-subtotal]').forEach(subtotal => { subtotal.textContent = formatIDR(product.price * value); });
    container.querySelectorAll('[data-quantity-step="-1"]').forEach(button => { button.disabled = value <= product.minPurchase; });
    container.querySelectorAll('[data-quantity-step="1"]').forEach(button => { button.disabled = value >= product.stock; });
    return value;
  };

  container.querySelectorAll('[data-quantity-step]').forEach(button => {
    button.addEventListener('click', () => {
      const input = button.closest('.product-page__stepper').querySelector('[data-quantity-input]');
      input.value = String(Number(input.value) + Number(button.dataset.quantityStep));
      normalizeQuantity(input);
    });
  });
  container.querySelectorAll('[data-quantity-input]').forEach(input => {
    input.addEventListener('change', () => normalizeQuantity(input));
    input.addEventListener('input', () => {
      const paired = [...container.querySelectorAll('[data-quantity-input]')].find(otherInput => otherInput !== input);
      if (paired) paired.value = input.value;
      const quantity = Number.parseInt(input.value, 10);
      if (Number.isFinite(quantity) && quantity > product.stock) {
        normalizeQuantity(input);
        return;
      }
      if (Number.isFinite(quantity) && quantity >= product.minPurchase && quantity <= product.stock) {
        container.querySelectorAll('[data-subtotal]').forEach(subtotal => { subtotal.textContent = formatIDR(product.price * quantity); });
        container.querySelectorAll('[data-quantity-step="-1"]').forEach(button => { button.disabled = quantity <= product.minPurchase; });
        container.querySelectorAll('[data-quantity-step="1"]').forEach(button => { button.disabled = quantity >= product.stock; });
      }
    });
  });
  normalizeQuantity(container.querySelector('[data-quantity-input]'));

  container.querySelectorAll('[data-variant-id]').forEach(button => {
    button.addEventListener('click', () => {
      container.querySelectorAll('[data-variant-id]').forEach(option => {
        const selected = option === button;
        option.classList.toggle('is-selected', selected);
        option.setAttribute('aria-pressed', String(selected));
        option.querySelector('.material-symbols-outlined').textContent = selected ? 'check_circle' : 'radio_button_unchecked';
      });
    });
  });
  container.querySelectorAll('[data-gallery-index]').forEach(button => {
    button.addEventListener('click', () => {
      container.querySelectorAll('[data-gallery-index]').forEach(thumbnail => {
        const selected = thumbnail === button;
        thumbnail.classList.toggle('is-active', selected);
        thumbnail.setAttribute('aria-pressed', String(selected));
      });
      const selectedImage = product.images[Number(button.dataset.galleryIndex)];
      const mainIllustration = container.querySelector('.product-page__gallery-main .product-page__illustration');
      mainIllustration.outerHTML = renderProductIllustration(product, selectedImage, Number(button.dataset.galleryIndex), 'product-page__illustration');
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
    Cart.addItem(product.id, normalizeQuantity(container.querySelector('[data-quantity-input]')));
  };
  container.querySelectorAll('[data-add-to-cart]').forEach(button => button.addEventListener('click', addToCart));
  container.querySelectorAll('[data-buy-now]').forEach(button => button.addEventListener('click', () => {
    if (!isAvailable) return;
    addToCart();
    window.location.href = './payment.html';
  }));
  container.querySelectorAll('[data-product-action]').forEach(button => {
    button.addEventListener('click', async () => {
      if (button.dataset.productAction === 'chat') {
        Toast.show('Chat dengan pemasok akan segera tersedia.', 'info', 'chat');
      } else if (button.dataset.productAction === 'wishlist') {
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
      } else {
        try {
          if (navigator.share) {
            await navigator.share({ title: product.title, url: window.location.href });
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
      }
    });
  });
};

const initProductPage = async () => {
  const productId = Number(new URLSearchParams(window.location.search).get('id'));
  if (!Number.isInteger(productId) || productId <= 0) {
    renderError('ID produk tidak valid.');
    return;
  }
  try {
    const result = await fetchApiData('./js/product.json');
    if (!Array.isArray(result.data)) throw new Error('Format data produk tidak valid.');
    const catalogProduct = result.data.find(product => product?.id === productId);
    if (!catalogProduct) {
      renderError('Produk yang Anda cari tidak ditemukan.');
      return;
    }
    state.products = [...state.products.filter(product => product.id !== catalogProduct.id), catalogProduct];
    renderProduct(createProductPageData(catalogProduct));
  } catch (error) {
    console.error('Unable to load the product details.', error);
    renderError(error instanceof Error ? error.message : String(error));
  }
};

document.addEventListener('DOMContentLoaded', initProductPage, { once: true });
