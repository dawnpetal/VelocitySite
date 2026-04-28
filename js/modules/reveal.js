export function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const delay = parseInt(e.target.dataset.d ?? '0', 10) * 80;
        setTimeout(() => e.target.classList.add('is-visible'), delay);
        io.unobserve(e.target);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' },
  );

  els.forEach((el) => io.observe(el));
}
