/**
 * @typedef {{ id: number, name: string, categoryLabel: string, price: number, priceUnit: string, minOrder: number, minOrderUnit: string, stock: number, stockUnit: string, location: string, province: string, rating: number, soldCount: string, desc: string }} CatalogProduct
 * @typedef {{ id: string, label: string }} ProductVariant
 * @typedef {{ id: string, alt: string }} ProductImage
 * @typedef {{ condition: string, unitWeight: string, minPurchase: string, category: string, showcase: string }} ProductSpecs
 * @typedef {{ name: string, verified: boolean }} ProductSeller
 * @typedef {{ id: number, title: string, images: ProductImage[], price: number, originalPrice: number, discountPercent: number, sold: string, rating: number, ratingCount: number, ratingDistribution: Record<number, number>, variants: ProductVariant[], stock: number, minPurchase: number, specs: ProductSpecs, description: string, seller: ProductSeller }} ProductPageData
 */

const placeholderVariants = [
  { id: 'standard', label: 'Standar' },
  { id: 'bulk', label: 'Pilihan grosir' }
];

const roundedOriginalPrice = price => Math.ceil((price / 0.85) / 500) * 500;

const createRatingDistribution = rating => {
  if (rating < 4.75) return { 5: 98, 4: 22, 3: 6, 2: 1, 1: 1 };
  if (rating < 4.85) return { 5: 110, 4: 15, 3: 2, 2: 1, 1: 0 };
  return { 5: 120, 4: 6, 3: 1, 2: 1, 1: 0 };
};

/**
 * Maps catalog records to a view model and fills unsupported fields with preview-only data.
 * @param {CatalogProduct} product
 * @returns {ProductPageData}
 */
export const createProductPageData = product => {
  const originalPrice = roundedOriginalPrice(product.price);
  return {
    id: product.id,
    title: product.name,
    images: ['overview', 'quality', 'packaging'].map((view, index) => ({
      id: view,
      alt: `${product.name}, ilustrasi ${['pasokan', 'kualitas', 'kemasan'][index]}`
    })),
    price: product.price,
    originalPrice,
    discountPercent: Math.max(1, Math.round((1 - product.price / originalPrice) * 100)),
    sold: product.soldCount,
    rating: product.rating,
    ratingCount: 128,
    ratingDistribution: createRatingDistribution(product.rating),
    variants: placeholderVariants,
    stock: product.stock,
    minPurchase: product.minOrder,
    specs: {
      condition: product.stock > 0 ? 'Tersedia' : 'Stok habis',
      unitWeight: `1 ${product.priceUnit}`,
      minPurchase: `${product.minOrder.toLocaleString('id-ID')} ${product.minOrderUnit}`,
      category: product.categoryLabel,
      showcase: product.province || product.location
    },
    description: product.desc,
    seller: {
      name: 'Pemasok Pilihan',
      verified: true
    }
  };
};
