// ============================================
// CeritaKu — Scroll Animations (Intersection Observer)
// ============================================

let observer = null;

/**
 * Initialize scroll-triggered animations
 */
export function initAnimations() {
  if (observer) {
    observer.disconnect();
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after animation triggers (one-time)
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  // Observe all reveal elements
  observeElements();
}

/**
 * Observe new elements (call after DOM updates)
 */
export function observeElements() {
  if (!observer) return;

  const elements = document.querySelectorAll(
    '.reveal:not(.visible), .reveal-left:not(.visible), .reveal-right:not(.visible), .reveal-scale:not(.visible)'
  );

  elements.forEach((el) => {
    observer.observe(el);
  });
}

/**
 * Cleanup observer
 */
export function destroyAnimations() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}
