import './components/page.js?v=landing-clean-21';
import { initPageLoader } from './modules/loader.js?v=landing-clean-21';
import { initLenis } from './modules/lenis.js?v=landing-clean-21';
import { initNav } from './modules/nav.js?v=landing-clean-21';
import { initReveal } from './modules/reveal.js?v=landing-clean-21';
import { initCopy } from './modules/copy.js?v=landing-clean-21';
import { initTutorialSearch } from './modules/search.js?v=landing-clean-21';
import { initShowcase } from './modules/showcase.js?v=landing-clean-21';
import { initHeroStage } from './modules/hero-stage.js?v=landing-clean-21';

function initExecutorCycle() {
  const label = document.getElementById('execLabel');
  if (!label) return;

  const executors = ['Hydrogen', 'Opiumware'];
  let index = 0;

  setInterval(() => {
    label.classList.add('is-switching');
    setTimeout(() => {
      index = (index + 1) % executors.length;
      label.textContent = executors[index];
      label.classList.remove('is-switching');
    }, 260);
  }, 3500);
}

function initInteractivePage() {
  initLenis();
  initNav();
  initReveal();
  initCopy();
  initExecutorCycle();
  initTutorialSearch();
  initShowcase();
  initHeroStage();
}

document.addEventListener('DOMContentLoaded', async () => {
  await initPageLoader();
  initInteractivePage();
});
