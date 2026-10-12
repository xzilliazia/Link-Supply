  /* ==========================================================================
     1. APPLICATION STATE
     ========================================================================== */
  export const state = {
    products: [],
    filteredProducts: [],
    productsLoading: true,
    productsError: false,
    productsMessage: '',
    categories: [],
    siteLoading: true,
    siteError: false,
    siteMessage: '',
    notifications: [],
    notificationList: null,
    notificationBadge: null,
    locationDropdown: null,
    currentCategory: 'all',
    currentLocation: 'all',
    searchQuery: '',
    currentSort: 'default',
    isExpanded: false,
    initialVisibleCount: 24,
    cart: JSON.parse(localStorage.getItem('linksupply_cart') || '[]'),
    addresses: JSON.parse(localStorage.getItem('linksupply_addresses') || '[]'),
    unreadNotifications: 0
  };

  /* ==========================================================================
     2. UTILITY HELPERS
     ========================================================================== */
  export const formatIDR = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(number);
  };

  export const saveCartToStorage = () => {
    localStorage.setItem('linksupply_cart', JSON.stringify(state.cart));
  };

  export const escapeHtml = (unsafe) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };
