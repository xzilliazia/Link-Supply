export const fetchApiData = async (url, options = {}) => {
    const response = await fetch(url, options);
    let result;

    try {
      result = await response.json();
    } catch {
      if (url.endsWith('.php')) {
        throw new Error(`Endpoint ${url} tidak mengembalikan JSON. Pastikan situs dijalankan melalui server PHP, bukan Live Server atau file://.`);
      }
      throw new Error(`Respons API ${url} bukan JSON yang valid.`);
    }

    if (!response.ok) {
      throw new Error(result?.message || `Request API gagal (${response.status}).`);
    }
    if (!result || typeof result !== 'object' || Array.isArray(result) || result.success !== true || typeof result.message !== 'string' || !('data' in result)) {
      throw new Error(result?.message || `Format respons API ${url} tidak valid.`);
    }

    return result;
  };
