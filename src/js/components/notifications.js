import { NOTIFICATIONS } from '../data/notifications.js';
import { state } from '../state.js';
import { closeOnOutsideClick, requireEl } from '../utils/dom.js';
import { escapeHtml } from '../utils/format.js';
import { showToast } from './toast.js';

const itemTemplate = (n) => `
  <div class="p-2.5 rounded-lg border flex items-start gap-2.5 ${n.highlight ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-gray-100'}">
    <span class="material-symbols-outlined ${n.iconClass} text-lg shrink-0 mt-0.5">${n.icon}</span>
    <div class="text-xs">
      <div class="font-bold text-gray-800">${escapeHtml(n.title)}</div>
      <div class="text-gray-600">${escapeHtml(n.text)}</div>
      <div class="text-[10px] text-gray-400 mt-1">${escapeHtml(n.time)}</div>
    </div>
  </div>
`;

export const initNotifications = () => {
  const trigger = requireEl('btnNotifications');
  const badge = requireEl('notifBadge');
  const panel = requireEl('notifPanel');

  requireEl('notifList').innerHTML = NOTIFICATIONS.map(itemTemplate).join('');

  const renderBadge = () => {
    badge.textContent = state.unreadNotifications;
    badge.classList.toggle('hidden', state.unreadNotifications === 0);
    badge.classList.toggle('flex', state.unreadNotifications > 0);
  };

  trigger.addEventListener('click', () => {
    const isHidden = panel.classList.toggle('hidden');
    if (isHidden) return;
    const rect = trigger.getBoundingClientRect();
    panel.style.top = `${rect.bottom + 12}px`;
    panel.style.right = `${Math.max(16, window.innerWidth - rect.right - 20)}px`;
  });

  requireEl('btnMarkRead').addEventListener('click', () => {
    state.unreadNotifications = 0;
    renderBadge();
    panel.classList.add('hidden');
    showToast('Semua notifikasi telah ditandai dibaca', 'info', 'done_all');
  });

  closeOnOutsideClick([panel, trigger], () => panel.classList.add('hidden'));
  renderBadge();
};
