import { DEFAULT_FILTERS, state } from './state.js';

/**
 * Satu pintu untuk mengubah filter katalog.
 * Komponen yang peduli (katalog, pill, label lokasi, input pencarian)
 * mendaftar lewat onFiltersChange — tidak ada lagi sinkronisasi manual antar modul.
 */
const listeners = new Set();

/** listener(filters, { reset }) — `reset` true jika semua filter dikembalikan ke default. */
export const onFiltersChange = (listener) => listeners.add(listener);

const notify = (meta) => listeners.forEach((listener) => listener(state.filters, meta));

export const updateFilters = (patch) => {
  Object.assign(state.filters, patch);
  notify({ reset: false });
};

export const resetFilters = () => {
  Object.assign(state.filters, DEFAULT_FILTERS);
  state.isExpanded = false;
  notify({ reset: true });
};
