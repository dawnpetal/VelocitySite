function initScoreBars() {
  const items = document.querySelectorAll('.exec-score-item');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-animated');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.3 },
  );

  items.forEach((item) => observer.observe(item));
}

document.addEventListener('DOMContentLoaded', initScoreBars);
