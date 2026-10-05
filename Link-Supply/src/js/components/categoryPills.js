import { CATEGORIES } from '../data/categories.js';
import { onFiltersChange, updateFilters } from '../filters.js';
import { state } from '../state.js';
import { requireEl } from '../utils/dom.js';
import { escapeHtml } from '../utils/format.js';

const PILL_BASE =
  'pill flex items-center gap-1.5 border py-1.5 px-2.5 sm:px-3 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap cursor-pointer';
const PILL_ACTIVE = 'active bg-primary-dark text-bg-muted border-primary-dark shadow-xs transition-all';
const PILL_INACTIVE =
  'bg-white text-text-main border-border-custom hover:bg-emerald-50 hover:text-primary transition-colors';

const pillTemplate = (category) => `
  <button type="button" class="${PILL_BASE}" data-category="${escapeHtml(category.id)}">
    <span class="material-symbols-outlined text-base">${category.icon}</span> ${escapeHtml(category.label)}
  </button>
`;

export const initCategoryPills = () => {
  const container = requireEl('categoryPills');
  container.innerHTML = CATEGORIES.map(pillTemplate).join('');

  const sync = () => {
    container.querySelectorAll('.pill').forEach((pill) => {
      const isActive = pill.dataset.category === state.filters.category;
      pill.className = `${PILL_BASE} ${isActive ? PILL_ACTIVE : PILL_INACTIVE}`;
      pill.setAttribute('aria-pressed', String(isActive));
    });
  };

  container.addEventListener('click', (e) => {
    const pill = e.target.closest('.pill');
    if (pill) updateFilters({ category: pill.dataset.category });
  });

  onFiltersChange(sync);
  sync();
};
