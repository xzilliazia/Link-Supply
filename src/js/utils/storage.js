/** localStorage yang aman: data rusak / storage diblokir tidak membuat aplikasi crash. */
export const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* penyimpanan penuh atau diblokir: abaikan, aplikasi tetap jalan */
  }
};
