/** Ambil elemen berdasarkan id; error jelas jika id hilang dari index.html. */
export const requireEl = (id) => {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Elemen #${id} tidak ditemukan di index.html`);
  return el;
};

export const lockPageScroll = (locked) => {
  document.body.style.overflow = locked ? 'hidden' : '';
};

export const scrollToProducts = () => {
  document
    .getElementById('productGrid')
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

/** Panggil `onOutside` jika klik terjadi di luar semua elemen yang diberikan. */
export const closeOnOutsideClick = (elements, onOutside) => {
  document.addEventListener('click', (event) => {
    if (elements.every((el) => !el.contains(event.target))) onOutside();
  });
};
