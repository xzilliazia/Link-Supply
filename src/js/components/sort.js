import { DEFAULT_FILTERS } from '../state.js';
import { onFiltersChange, updateFilters } from '../filters.js';
import { requireEl } from '../utils/dom.js';

export const initSort = () => {
  const select = requireEl('sortProducts');

  select.addEventListener('change', () => updateFilters({ sort: select.value }));

  onFiltersChange((_, { reset }) => {
    if (reset) select.value = DEFAULT_FILTERS.sort;
  });
};
