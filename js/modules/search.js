export function initTutorialSearch() {
  const input = document.querySelector('.tut-search-input');
  if (!input) return;

  const cards = [...document.querySelectorAll('.tut-card')];
  const empty = document.querySelector('.tut-empty');

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    let visible = 0;

    cards.forEach((card) => {
      const match = !q || card.textContent.toLowerCase().includes(q);
      card.hidden = !match;
      if (match) visible++;
    });

    empty.hidden = visible > 0;
  });
}
