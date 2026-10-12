const hasImageSource = image => Boolean(
  image.getAttribute('src')?.trim() || image.getAttribute('srcset')?.trim()
);

const setImageState = (image, state) => {
  image.classList.remove('image-loading', 'image-loaded', 'image-error');
  image.classList.add(`image-${state}`);
};

const trackImage = image => {
  if (!image.dataset.imageLoadingTracked) {
    image.dataset.imageLoadingTracked = 'true';
    image.addEventListener('load', () => setImageState(image, 'loaded'));
    image.addEventListener('error', () => setImageState(image, 'error'));
  }

  if (!hasImageSource(image)) {
    image.classList.remove('image-loading', 'image-loaded', 'image-error');
    return;
  }

  image.classList.remove('image-loaded', 'image-error');
  image.classList.add('image-loading');

  if (image.complete) {
    setImageState(image, image.naturalWidth > 0 ? 'loaded' : 'error');
  }
};

const trackImagesIn = node => {
  if (!(node instanceof Element)) return;
  if (node instanceof HTMLImageElement) trackImage(node);
  node.querySelectorAll('img').forEach(trackImage);
};

const initImageLoading = () => {
  trackImagesIn(document.documentElement);

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type === 'attributes' && mutation.target instanceof HTMLImageElement) {
        trackImage(mutation.target);
      } else {
        mutation.addedNodes.forEach(trackImagesIn);
      }
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['src', 'srcset'],
    childList: true,
    subtree: true
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initImageLoading, { once: true });
} else {
  initImageLoading();
}
