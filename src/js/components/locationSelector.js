import { REGIONS } from '../data/regions.js';
import { onFiltersChange, updateFilters } from '../filters.js';
import { state } from '../state.js';
import { closeOnOutsideClick, requireEl } from '../utils/dom.js';
import { showToast } from './toast.js';

const OPTIONS = [
  { value: 'all', label: 'Semua Wilayah' },
  ...REGIONS.map((region) => ({ value: region, label: region })),
];

const optionTemplate = ({ value, label }) => `
  <button type="button" class="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-emerald-50 hover:text-primary rounded-md font-medium cursor-pointer" data-region="${value}">${label}</button>
`;

export const initLocationSelector = () => {
  const trigger = requireEl('locationSelector');
  const label = requireEl('locationLabel');
  const dropdown = requireEl('locationDropdown');
  const list = requireEl('locationOptions');

  list.innerHTML = OPTIONS.map(optionTemplate).join('');

  const close = () => dropdown.classList.add('hidden');

  trigger.addEventListener('click', () => {
    const isHidden = dropdown.classList.toggle('hidden');
    if (isHidden) return;
    const rect = trigger.getBoundingClientRect();
    dropdown.style.top = `${rect.bottom + 8}px`;
    dropdown.style.left = `${rect.left}px`;
  });

  list.addEventListener('click', (e) => {
    const option = e.target.closest('[data-region]');
    if (!option) return;
    const region = option.dataset.region;
    close();
    updateFilters({ region });
    showToast(
      `Menampilkan pasokan wilayah: <strong>${region === 'all' ? 'Semua Wilayah' : region}</strong>`,
      'info',
      'location_on',
    );
  });

  // Label selalu mengikuti state (juga saat filter di-reset)
  onFiltersChange(() => {
    label.textContent = state.filters.region === 'all' ? 'Lokasi' : state.filters.region;
  });

  closeOnOutsideClick([dropdown, trigger], close);
};
