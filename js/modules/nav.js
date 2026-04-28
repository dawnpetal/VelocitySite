export function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  let ticking = false;

  const update = () => {
    nav.classList.toggle('scrolled', window.scrollY > 24);
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true },
  );

  update();
}
