import { BACK_TO_TOP_OFFSET_PX } from '../config.js';
import { requireEl } from '../utils/dom.js';

export const initBackToTop = () => {
  const button = requireEl('btnBackToTop');

  const sync = () => {
    const isVisible = window.scrollY > BACK_TO_TOP_OFFSET_PX;
    button.classList.toggle('visible', isVisible);
    button.classList.toggle('hidden-btn', !isVisible);
  };

  window.addEventListener('scroll', sync, { passive: true });
  button.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  sync();
};
