let lenisInstance = null;
let lenisPromise = null;

async function loadLenis() {
  if (lenisInstance) return lenisInstance;
  if (lenisPromise) return lenisPromise;

  lenisPromise = import('https://cdn.jsdelivr.net/npm/lenis@1.1.20/dist/lenis.mjs')
    .then(({ default: Lenis }) => {
      lenisInstance = new Lenis({
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.15,
        syncTouch: false,
      });

      const raf = (time) => {
        lenisInstance?.raf(time);
        requestAnimationFrame(raf);
      };

      requestAnimationFrame(raf);
      window.dispatchEvent(new CustomEvent('velocity:lenis-ready', { detail: lenisInstance }));
      return lenisInstance;
    })
    .catch(() => null);

  return lenisPromise;
}

export function initLenis() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  void loadLenis();
}

export function getLenis() {
  return lenisInstance;
}
