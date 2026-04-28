const READY_TIMEOUT = 2200;
const MIN_VISIBLE = 1350;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withTimeout(promise, ms) {
  return Promise.race([promise, wait(ms)]);
}

async function decodeImage(img) {
  if (!img) return;
  if (img.complete && img.naturalWidth > 0) return;
  if (typeof img.decode === 'function') {
    await img.decode().catch(() => {});
    return;
  }
  await new Promise((resolve) => {
    img.addEventListener('load', resolve, { once: true });
    img.addEventListener('error', resolve, { once: true });
  });
}

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = resolve;
    img.src = src;
  });
}

async function waitForLandingAssets() {
  const hero = document.querySelector('.hero-stage-image');
  const shots = [...document.querySelectorAll('.showcase-shot')];
  const themes = [...document.querySelectorAll('[data-theme-src]')]
    .map((card) => card.dataset.themeSrc)
    .filter(Boolean);
  const cursorSources = [
    'assets/cursors/Cursor_Cursor.png',
    'assets/cursors/Cursor_Pointer.png',
    'assets/cursors/Cursor_Type.png',
  ];

  await Promise.allSettled([
    document.fonts?.ready ?? Promise.resolve(),
    decodeImage(hero),
    ...shots.map(decodeImage),
    ...themes.map(preloadImage),
    ...cursorSources.map(preloadImage),
  ]);
}

function setProgress(el, value) {
  if (el) el.textContent = String(Math.max(1, Math.min(100, Math.round(value))));
}

function runProgress(el) {
  let value = 1;
  setProgress(el, value);

  const timer = setInterval(() => {
    value += Math.max(1, Math.round((94 - value) * 0.055));
    setProgress(el, Math.min(value, 92));
    if (value >= 92) clearInterval(timer);
  }, 92);

  return {
    stop: () => clearInterval(timer),
    finish: () =>
      new Promise((resolve) => {
        const start = value;
        const startedAt = performance.now();
        const duration = 920;

        const tick = (now) => {
          const t = Math.min(1, (now - startedAt) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          setProgress(el, start + (100 - start) * eased);
          if (t < 1) requestAnimationFrame(tick);
          else resolve();
        };

        requestAnimationFrame(tick);
      }),
  };
}

export async function initPageLoader() {
  const root = document.documentElement;
  const loader = document.getElementById('pageLoader');
  const percent = document.getElementById('loaderPercent');

  if (!loader) return;

  const startedAt = performance.now();
  const progress = runProgress(percent);
  await withTimeout(waitForLandingAssets(), READY_TIMEOUT);
  await wait(Math.max(0, MIN_VISIBLE - (performance.now() - startedAt)));
  progress.stop();
  await progress.finish();

  root.classList.add('is-ready');
  root.classList.remove('is-loading');
  loader.classList.add('is-revealing');
  await wait(520);
  loader.classList.add('is-hidden');
  loader.setAttribute('aria-hidden', 'true');
  setTimeout(() => loader.remove(), 1500);
}
