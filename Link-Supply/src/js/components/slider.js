import { SLIDER } from '../config.js';
import { BANNERS } from '../data/banners.js';
import { requireEl } from '../utils/dom.js';
import { escapeHtml } from '../utils/format.js';

const slideTemplate = (banner) => `
  <section class="slide-banner min-w-full w-full shrink-0 relative flex flex-col items-center justify-center text-center text-white min-h-[200px] sm:min-h-[250px] md:min-h-[290px] py-8 sm:py-11 md:py-14 px-4 sm:px-8 bg-cover bg-center"
           style="background-image: var(--slide-overlay), url('${escapeHtml(banner.image)}');">
    <div class="max-w-2xl px-2">
      <span class="inline-block bg-bg-muted/95 text-primary-dark text-xs font-bold px-3.5 py-1 rounded-md mb-3 sm:mb-4 tracking-wider shadow-sm">${escapeHtml(banner.badge)}</span>
      <h2 class="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 leading-tight text-white">${escapeHtml(banner.title)}</h2>
      <p class="text-xs sm:text-sm md:text-base text-white/90 mb-5 sm:mb-6 leading-relaxed">${escapeHtml(banner.desc)}</p>
      <button type="button" class="btn-ad bg-bg-muted hover:bg-white text-primary-dark font-bold text-xs sm:text-sm md:text-base py-2.5 sm:py-3.5 px-5 sm:px-7 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer" data-category="${escapeHtml(banner.category)}">${escapeHtml(banner.cta)}</button>
    </div>
  </section>
`;

/**
 * Carousel banner: render dari data/banners.js, auto-slide, dots, swipe sentuh.
 * @param {{ onCtaClick: (category: string) => void }} options
 */
export const initSlider = ({ onCtaClick }) => {
  const slider = requireEl('adSlider');
  const track = requireEl('sliderWrapper');
  const dotsEl = requireEl('sliderDots');
  const total = BANNERS.length;

  track.innerHTML = BANNERS.map(slideTemplate).join('');
  dotsEl.innerHTML = BANNERS.map(
    (_, i) => `<button type="button" class="slider-dot" data-index="${i}" aria-label="Pindah ke slide ${i + 1}"></button>`,
  ).join('');
  const dots = [...dotsEl.children];

  let current = 0;
  let timer = null;

  const show = (index) => {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((dot, i) => dot.classList.toggle('active', i === current));
  };

  const stopAuto = () => {
    clearInterval(timer);
    timer = null;
  };
  const startAuto = () => {
    stopAuto();
    timer = setInterval(() => show(current + 1), SLIDER.autoSlideMs);
  };
  const go = (index) => {
    show(index);
    startAuto();
  };

  requireEl('slidePrev').addEventListener('click', () => go(current - 1));
  requireEl('slideNext').addEventListener('click', () => go(current + 1));
  dotsEl.addEventListener('click', (e) => {
    const dot = e.target.closest('.slider-dot');
    if (dot) go(Number(dot.dataset.index));
  });

  track.addEventListener('click', (e) => {
    const cta = e.target.closest('.btn-ad');
    if (cta) onCtaClick(cta.dataset.category);
  });

  // Jeda saat kursor di atas slider
  slider.addEventListener('mouseenter', stopAuto);
  slider.addEventListener('mouseleave', startAuto);

  // Swipe di layar sentuh
  let touchStartX = 0;
  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAuto();
  }, { passive: true });
  slider.addEventListener('touchend', (e) => {
    const delta = touchStartX - e.changedTouches[0].screenX;
    if (delta > SLIDER.swipeThresholdPx) show(current + 1);
    else if (delta < -SLIDER.swipeThresholdPx) show(current - 1);
    startAuto();
  }, { passive: true });

  show(0);
  startAuto();
};
