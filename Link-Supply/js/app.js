import { Toast } from './toast.js';
import { initCatalog } from './catalog.js';
import { Cart } from './cart.js';
import { Profile } from './profile.js';
import { QuickView } from './product-detail.js';
import { initGlobalEvents } from './events.js';
import { initSite } from './site-ui.js';

document.addEventListener('DOMContentLoaded', () => {
  Toast.init();
  Cart.init();
  Profile.init();
  QuickView.init();
  initSite();
  initCatalog();
  initGlobalEvents();
});
