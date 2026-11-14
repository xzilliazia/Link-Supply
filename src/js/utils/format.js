const idrFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export const formatIDR = (amount) => idrFormatter.format(amount);

export const formatNumber = (value) => value.toLocaleString('id-ID');

/** Wajib dipakai untuk teks dari pengguna yang disisipkan lewat innerHTML. */
export const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
