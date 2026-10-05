/**
 * KATEGORI — dipakai oleh pill kategori (UI), filter, dan pencarian.
 * `id` 'all' adalah nilai khusus: artinya tanpa filter kategori.
 */
export const CATEGORIES = [
  { id: 'all', label: 'Semua', icon: 'eco' },
  { id: 'perikanan', label: 'Perikanan', icon: 'water' },
  { id: 'pertanian', label: 'Pertanian', icon: 'wheat' },
  { id: 'bahan-makanan', label: 'Bahan Makanan', icon: 'grocery' },
  { id: 'perkebunan', label: 'Perkebunan', icon: 'potted_plant' },
  // Belum ada produk di kategori ini, jadi memilihnya menampilkan "Produk Tidak Ditemukan".
  { id: 'lainnya', label: 'Lainnya', icon: 'steppers' },
];

export const getCategoryLabel = (id) =>
  CATEGORIES.find((category) => category.id === id)?.label ?? '';
