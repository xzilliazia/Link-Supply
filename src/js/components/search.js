import { CATALOG } from '../config.js';
import { onFiltersChange, updateFilters } from '../filters.js';
import { requireEl } from '../utils/dom.js';

export const initSearch = () => {
  const input = requireEl('searchInput');
  const searchBtn = requireEl('btnSearch');
  const clearBtn = requireEl('btnClearSearch');
  let debounceTimer = null;

  const applySearch = () => {
    clearTimeout(debounceTimer);
    updateFilters({ query: input.value });
    clearBtn.classList.toggle('hidden', input.value.trim().length === 0);
  };

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(applySearch, CATALOG.searchDebounceMs);
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') applySearch();
  });
  searchBtn.addEventListener('click', applySearch);
  clearBtn.addEventListener('click', () => {
    input.value = '';
    applySearch();
    input.focus();
  });

  // Saat "Reset Semua Filter", kosongkan input & sembunyikan tombol hapus
  onFiltersChange((_, { reset }) => {
    if (!reset) return;
    input.value = '';
    clearBtn.classList.add('hidden');
  });
};
