import { Toast } from './toast.js';
import { initCatalog } from './catalog.js';
import { Cart } from './cart.js';
import { Profile } from './profile.js';
import { initGlobalEvents } from './events.js';
import { initSite } from './site-ui.js';

document.addEventListener('DOMContentLoaded', () => {
  const initialDataController = new AbortController();

  Toast.init();
  Cart.init();
  Profile.init();
  const siteDataReady = initSite(initialDataController.signal);
  const catalogDataReady = initCatalog(initialDataController.signal);
  initGlobalEvents();

  const loader = document.getElementById('pageLoader');
  const timeoutError = document.getElementById('pageTimeoutError');

  window.handlePageLoadTimeout = () => {
    initialDataController.abort();
    loader?.classList.add('is-hidden');
    loader?.setAttribute('aria-hidden', 'true');
    timeoutError?.removeAttribute('hidden');
  };

  Promise.all([siteDataReady, catalogDataReady])
    .catch(error => {
      console.error('Unable to finish loading the page.', error);
    })
    .finally(() => {
      window.clearTimeout(window.pageLoadTimeoutId);
      window.handlePageLoadTimeout = null;
      if (loader) {
        loader.classList.add('is-hidden');
        loader.setAttribute('aria-hidden', 'true');
      }
    });
});
