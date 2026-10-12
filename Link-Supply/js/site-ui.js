import { state } from './core.js';
import { fetchApiData } from './api.js';
import { Toast } from './toast.js';
import { setCategoryFilter } from './catalog.js';

  /* ==========================================================================
     4. HERO SLIDER CONTROLLER
     ========================================================================== */
  export const initSlider = (setCategoryFilter) => {
    const slider = document.getElementById('adSlider');
    const wrapper = document.getElementById('sliderWrapper');
    const slides = wrapper ? wrapper.querySelectorAll('.slide-banner') : [];
    const prevBtn = document.getElementById('slidePrev');
    const nextBtn = document.getElementById('slideNext');
    const dotsContainer = document.getElementById('sliderDots');

    if (!slider || !wrapper || slides.length === 0) return;

    const totalSlides = slides.length;
    let currentIndex = 0;
    let autoSlideTimer = null;

    dotsContainer.innerHTML = '';
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('slider-dot');
      if (index === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Pindah ke slide ${index + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetAutoSlide();
      });
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.slider-dot');

    const updateSlider = () => {
      wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    };

    const goToSlide = (index) => {
      currentIndex = (index + totalSlides) % totalSlides;
      updateSlider();
    };

    const nextSlide = () => goToSlide(currentIndex + 1);
    const prevSlide = () => goToSlide(currentIndex - 1);

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoSlide();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoSlide();
      });
    }

    const startAutoSlide = () => {
      stopAutoSlide();
      autoSlideTimer = setInterval(nextSlide, 5000);
    };

    const stopAutoSlide = () => {
      if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
        autoSlideTimer = null;
      }
    };

    const resetAutoSlide = () => {
      stopAutoSlide();
      startAutoSlide();
    };

    slider.addEventListener('mouseenter', stopAutoSlide);
    slider.addEventListener('mouseleave', startAutoSlide);

    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoSlide();
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        nextSlide();
      } else if (touchEndX - touchStartX > 50) {
        prevSlide();
      }
      startAutoSlide();
    }, { passive: true });

    startAutoSlide();

    // Banner CTA buttons link to product category or action
    const bannerBtns = slider.querySelectorAll('.btn-ad');
    bannerBtns.forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        const categories = ['all', 'all', 'perikanan', 'pertanian', 'all'];
        const targetCategory = categories[idx] || 'all';
        setCategoryFilter(targetCategory);
        document.getElementById('productGrid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        Toast.show(`Menampilkan promo & katalog pilihan`, 'info', 'local_offer');
      });
    });
  };

  /* ==========================================================================
     8. NOTIFICATION PANEL
     ========================================================================== */
  const updateNotificationBadge = () => {
    state.unreadNotifications = state.notifications.filter(notification => notification.unread).length;
    if (!state.notificationBadge) return;
    state.notificationBadge.textContent = `${state.unreadNotifications}`;
    state.notificationBadge.style.display = state.unreadNotifications ? 'flex' : 'none';
  };

  const renderNotifications = () => {
    const list = state.notificationList;
    if (!list) return;
    list.replaceChildren();

    if (state.siteLoading) {
      list.innerHTML = '<div class="py-8 text-center text-xs text-gray-500" role="status">Memuat notifikasi...</div>';
      return;
    }
    if (state.siteError) {
      const message = document.createElement('p');
      message.className = 'py-5 text-center text-xs text-red-600';
      message.setAttribute('role', 'alert');
      message.textContent = state.siteMessage;
      list.appendChild(message);
      const retry = document.createElement('button');
      retry.className = 'block mx-auto text-xs font-semibold text-primary cursor-pointer';
      retry.textContent = 'Coba lagi';
      retry.addEventListener('click', loadSiteData);
      list.appendChild(retry);
      return;
    }

    const notificationStyles = {
      promo: { icon: 'local_offer', color: 'text-primary', background: 'bg-emerald-50 border-emerald-100' },
      delivery: { icon: 'local_shipping', color: 'text-blue-500', background: 'bg-gray-50 border-gray-100' },
      supply: { icon: 'inventory', color: 'text-amber-500', background: 'bg-gray-50 border-gray-100' }
    };

    state.notifications.forEach(notification => {
      const style = notificationStyles[notification.type] || notificationStyles.supply;
      const item = document.createElement('div');
      item.className = `p-2.5 rounded-lg border flex items-start gap-2.5 ${style.background}`;
      const icon = document.createElement('span');
      icon.className = `material-symbols-outlined ${style.color} text-lg shrink-0 mt-0.5`;
      icon.textContent = style.icon;
      const content = document.createElement('div');
      content.className = 'text-xs';
      const title = document.createElement('div');
      title.className = 'font-bold text-gray-800';
      title.textContent = notification.title;
      const message = document.createElement('div');
      message.className = 'text-gray-600';
      message.textContent = notification.message;
      const time = document.createElement('div');
      time.className = 'text-[10px] text-gray-400 mt-1';
      time.textContent = notification.time;
      content.append(title, message, time);
      item.append(icon, content);
      list.appendChild(item);
    });
    updateNotificationBadge();
  };

  const renderCategories = () => {
    const container = document.querySelector('.category-pills');
    if (!container) return;
    container.replaceChildren();

    if (state.siteLoading) {
      container.innerHTML = '<span class="py-2 text-xs text-gray-500" role="status">Memuat kategori...</span>';
      return;
    }
    if (state.siteError) {
      const error = document.createElement('span');
      error.className = 'text-xs text-red-600';
      error.setAttribute('role', 'alert');
      error.textContent = state.siteMessage;
      const retry = document.createElement('button');
      retry.className = 'text-xs font-semibold text-primary cursor-pointer';
      retry.textContent = 'Coba lagi';
      retry.addEventListener('click', loadSiteData);
      container.append(error, retry);
      return;
    }

    state.categories.forEach(category => {
      const pill = document.createElement('a');
      pill.href = '#';
      pill.dataset.category = category.id;
      pill.className = 'pill flex items-center gap-1.5 bg-white text-text-main border border-border-custom hover:bg-emerald-50 hover:text-primary py-1.5 px-2.5 sm:px-3 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer';
      const icon = document.createElement('span');
      icon.className = 'material-symbols-outlined text-base';
      icon.textContent = category.icon;
      pill.append(icon, document.createTextNode(category.label));
      container.appendChild(pill);
    });
    setCategoryFilter(state.currentCategory);
  };

  export const initNotifications = () => {
    const notifBtn = document.querySelector('.icon-group span:first-child');
    if (!notifBtn) return;

    notifBtn.classList.add('relative', 'inline-flex');
    const badge = document.createElement('span');
    badge.className = 'notif-badge absolute -top-1.5 -right-2 bg-amber-500 text-white text-[10px] font-bold h-4 w-4 rounded-full items-center justify-center shadow-xs';
    notifBtn.appendChild(badge);
    state.notificationBadge = badge;

    const panel = document.createElement('div');
    panel.className = 'notif-panel fixed w-80 sm:w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 hidden card-fade-in';
    panel.innerHTML = `
      <div class="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
        <div class="flex items-center gap-1.5">
          <span class="material-symbols-outlined text-primary text-xl">notifications</span>
          <span class="font-bold text-sm text-gray-800">Notifikasi</span>
        </div>
        <button id="btnMarkRead" class="text-xs text-primary hover:text-primary-dark font-medium cursor-pointer">Tandai dibaca</button>
      </div>
      <div id="notificationList" class="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar"></div>
    `;
    document.body.appendChild(panel);
    state.notificationList = panel.querySelector('#notificationList');
    renderNotifications();

    let closeTimer = null;
    const positionPanel = () => {
      const rect = notifBtn.getBoundingClientRect();
      panel.style.top = `${Math.max(12, rect.bottom + 12)}px`;
      panel.style.right = `${Math.max(12, window.innerWidth - rect.right)}px`;
    };
    const showPanel = () => {
      clearTimeout(closeTimer);
      positionPanel();
      panel.classList.remove('hidden');
    };
    const scheduleClose = () => {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(() => panel.classList.add('hidden'), 180);
    };

    notifBtn.addEventListener('mouseenter', showPanel);
    notifBtn.addEventListener('mouseleave', scheduleClose);
    panel.addEventListener('mouseenter', () => clearTimeout(closeTimer));
    panel.addEventListener('mouseleave', scheduleClose);

    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (panel.classList.contains('hidden')) showPanel();
      else panel.classList.add('hidden');
    });

    panel.querySelector('#btnMarkRead').addEventListener('click', () => {
      state.notifications.forEach(notification => {
        notification.unread = false;
      });
      updateNotificationBadge();
      Toast.show('Semua notifikasi telah ditandai dibaca', 'info', 'done_all');
      panel.classList.add('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!panel.contains(e.target) && !notifBtn.contains(e.target)) {
        clearTimeout(closeTimer);
        panel.classList.add('hidden');
      }
    });
  };

  /* ==========================================================================
     10. BACK TO TOP BUTTON
     ========================================================================== */
  export const initBackToTop = () => {
    let btn = document.getElementById('btnBackToTop');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'btnBackToTop';
      btn.className = 'fixed bottom-6 right-6 w-11 h-11 bg-primary hover:bg-primary-dark text-white rounded-full shadow-lg flex items-center justify-center z-40 hidden-btn cursor-pointer';
      btn.setAttribute('aria-label', 'Kembali ke atas');
      btn.innerHTML = '<span class="material-symbols-outlined text-2xl">arrow_upward</span>';
      document.body.appendChild(btn);
    }

    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        btn.classList.remove('hidden-btn');
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
        btn.classList.add('hidden-btn');
      }
    }, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const loadSiteData = async () => {
    state.siteLoading = true;
    state.siteError = false;
    state.siteMessage = '';
    renderCategories();
    renderNotifications();

    try {
      const result = await fetchApiData('./js/site.json');
      const data = result.data;
      const categories = data?.categories;
      const notifications = data?.notifications;
      if (
        !Array.isArray(categories) ||
        categories.some(category => !category || typeof category.id !== 'string' || typeof category.label !== 'string' || typeof category.icon !== 'string') ||
        !Array.isArray(notifications) ||
        notifications.some(notification => (
          !notification ||
          typeof notification.title !== 'string' ||
          typeof notification.message !== 'string' ||
          typeof notification.time !== 'string' ||
          typeof notification.unread !== 'boolean'
        ))
      ) {
        throw new Error('Format data kategori dan notifikasi dari API tidak valid.');
      }

      state.categories = categories;
      state.notifications = notifications;
      state.siteMessage = result.message;
      state.siteLoading = false;
      renderCategories();
      renderNotifications();
    } catch (error) {
      console.error('Unable to load the site dataset.', error);
      state.siteLoading = false;
      state.siteError = true;
      state.siteMessage = error instanceof Error ? error.message : String(error);
      renderCategories();
      renderNotifications();
    }
  };


export const initSite = () => {
  initSlider(setCategoryFilter);
  initNotifications();
  initBackToTop();
  loadSiteData();
};
