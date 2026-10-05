/**
 * LinkSupply — titik masuk aplikasi.
 * Urutan di bawah = urutan inisialisasi. Tiap komponen berdiri sendiri di js/components/.
 *
 * Alur data:  data/*.js  ->  state.js  ->  filters.js  ->  components/*  ->  DOM
 */
import { initActions } from './actions.js';
import { initBackToTop } from './components/backToTop.js';
import { initCart } from './components/cart.js';
import { initCatalog } from './components/catalog.js';
import { initCategoryPills } from './components/categoryPills.js';
import { initLocationSelector } from './components/locationSelector.js';
import { initNewsletter } from './components/newsletter.js';
import { initNotifications } from './components/notifications.js';
import { initQuickView } from './components/quickView.js';
import { initSearch } from './components/search.js';
import { initSlider } from './components/slider.js';
import { initSort } from './components/sort.js';
import { showToast } from './components/toast.js';
import { updateFilters } from './filters.js';
import { scrollToProducts } from './utils/dom.js';

// Overlay & navbar
initCart();
initQuickView();
initNotifications();
initLocationSelector();
initSearch();

// Katalog (pill & sort mendaftar ke filters.js sebelum katalog pertama dirender)
initSort();
initCategoryPills();
initCatalog();

// Hero & pelengkap
initSlider({
  onCtaClick: (category) => {
    updateFilters({ category });
    scrollToProducts();
    showToast('Menampilkan promo & katalog pilihan', 'info', 'local_offer');
  },
});
initBackToTop();
initNewsletter();

// Klik & keyboard global (paling akhir)
initActions();
