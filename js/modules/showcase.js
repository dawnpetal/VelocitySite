import { getLenis } from './lenis.js?v=landing-clean-21';

const GAP = 32;

function clamp(v, lo, hi) {
  return Math.min(hi, Math.max(lo, v));
}
function lerp(a, b, t) {
  return a + (b - a) * t;
}
function easeOutQuint(t) {
  return 1 - Math.pow(1 - t, 5);
}
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
function easeInOutQuart(t) {
  return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
}

function pageY(el) {
  let y = 0;
  let node = el;
  while (node) {
    y += node.offsetTop || 0;
    node = node.offsetParent;
  }
  return y;
}

export function initShowcase() {
  const frameShell = document.getElementById('scFrameShell');
  const sticky = document.querySelector('.showcase-sticky');
  const stageWrap = document.querySelector('.showcase-stage-wrap');
  const frame = document.querySelector('.showcase-frame--shots');
  const panelA = document.getElementById('scPanelA');
  const panelB = document.getElementById('scPanelB');
  const panelC = document.getElementById('scPanelC');
  const trackFillA = document.getElementById('scTrackFill');
  const trackFillB = document.getElementById('scTrackFillB');
  const trackFillC = document.getElementById('scTrackFillC');
  const themeParade = document.getElementById('themeParade');

  if (
    !frameShell ||
    !sticky ||
    !stageWrap ||
    !frame ||
    !panelA ||
    !panelB ||
    !panelC ||
    !trackFillA ||
    !trackFillB ||
    !trackFillC ||
    !themeParade
  )
    return;

  const stepsA = [...panelA.querySelectorAll('.sc-step')];
  const stepsB = [...panelB.querySelectorAll('.sc-step')];
  const stepsC = [...panelC.querySelectorAll('.sc-step')];
  const shots = [...frame.querySelectorAll('.showcase-shot')];
  const themeCards = [...themeParade.querySelectorAll('[data-theme-card]')];
  const totalA = stepsA.length;
  const totalB = stepsB.length;
  const totalC = stepsC.length;
  const totalShots = totalA + totalB;

  let currentStep = -1;
  let sectionStart = 0;
  let bounds;
  let panelCenterY = 0;
  let frameW = 720;
  let themeW = 560;
  let panelW = 304;
  let latestScroll = getLenis()?.scroll ?? window.scrollY;
  let frameToken = null;
  let skipUntil = 0;

  function contentBounds() {
    const rect = stageWrap.getBoundingClientRect();
    return {
      left: rect.left,
      right: rect.right,
      center: rect.left + rect.width / 2,
    };
  }

  function measure() {
    sectionStart = pageY(sticky);
    bounds = contentBounds();
    frameW = frame.getBoundingClientRect().width || 720;
    themeW = themeParade.getBoundingClientRect().width || 820;
    panelW = panelA.getBoundingClientRect().width || 304;
    panelCenterY = window.innerHeight * 0.48;
  }

  function frameRightX(bounds) {
    return bounds.right - frameW;
  }

  function frameLeftX(bounds) {
    return bounds.left;
  }

  function panelMidLeft(bounds) {
    const space = frameRightX(bounds) - bounds.left;
    return bounds.left + Math.max(GAP, (space - panelW) / 2);
  }

  function panelMidRight(bounds) {
    const start = frameLeftX(bounds) + frameW;
    const space = bounds.right - start;
    return start + Math.max(GAP, (space - panelW) / 2);
  }

  function applyFrame(x, angle, lift = 0, scale = 1) {
    frameShell.style.transform = `translate(${x.toFixed(2)}px, -50%) translateY(${lift.toFixed(2)}px) scale(${scale.toFixed(4)})`;
    frame.style.transform = `rotate(${angle.toFixed(3)}deg)`;
  }

  function applyPanel(el, x, op, drift) {
    const alpha = clamp(op, 0, 1);
    const dx = drift * (1 - alpha);
    el.style.transform = `translate(${(x + dx).toFixed(2)}px, ${panelCenterY.toFixed(2)}px) translateY(-50%)`;
    el.style.opacity = String(alpha);
    el.style.pointerEvents = op > 0.05 ? 'auto' : 'none';
  }

  function applyThemeParade(x, op, lift = 0) {
    themeParade.style.opacity = String(clamp(op, 0, 1));
    themeParade.style.transform = `translate(${x.toFixed(2)}px, -50%) translateY(${lift.toFixed(2)}px)`;
  }

  function themeRightX(bounds) {
    return bounds.right - themeW + 34;
  }

  function panelThemeLeft(bounds) {
    const space = themeRightX(bounds) - bounds.left;
    return bounds.left + Math.max(GAP, (space - panelW) / 2);
  }

  function applyThemeFan(progress) {
    const maxIndex = Math.max(1, themeCards.length - 1);
    const position = clamp(progress, 0, 1) * maxIndex;

    themeCards.forEach((card, i) => {
      const offset = i - position;
      const abs = Math.abs(offset);
      const visible = abs < 2.55;
      const x = offset * 96;
      const y = abs * 15 - 2;
      const rot = offset * 6.4;
      const scale = Math.max(0.74, 1 - abs * 0.058);
      card.classList.toggle('active', abs < 0.5);
      card.style.zIndex = String(30 - Math.round(abs * 4));
      card.style.opacity = visible ? String(clamp(1 - abs * 0.26, 0, 1)) : '0';
      card.style.filter = `saturate(${clamp(1.08 - abs * 0.06, 0.78, 1.08).toFixed(2)})`;
      card.style.transform = `translate(calc(-50% + ${x.toFixed(2)}px), calc(-50% + ${y.toFixed(2)}px)) rotate(${rot.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
    });
  }

  function hydrateThemeImages() {
    themeCards.forEach(async (card) => {
      const src = card.dataset.themeSrc;
      if (!src) return;
      let available = false;
      try {
        const response = await fetch(src, { method: 'HEAD', cache: 'force-cache' });
        available = response.ok;
      } catch {
        available = false;
      }
      if (!available || card.querySelector('.theme-card-image')) return;
      const img = new Image();
      img.className = 'theme-card-image';
      img.alt = '';
      img.decoding = 'async';
      img.onload = () => {
        card.prepend(img);
        card.classList.add('has-image');
      };
      img.src = src;
    });
  }

  function timeline(vh) {
    return {
      entry: vh * 0.18,
      aStart: vh * 0.16,
      aEnd: vh * 0.9,
      crossStart: vh * 0.9,
      crossEnd: vh * 1.2,
      bStart: vh * 1.2,
      bEnd: vh * 1.85,
      themeStart: vh * 1.85,
      themeEnd: vh * 3.05,
      exit: vh * 3.25,
    };
  }

  function tick(scroll) {
    const vh = window.innerHeight;
    const raw = scroll - sectionStart;
    const t = timeline(vh);

    if (raw < 0) {
      frameShell.style.opacity = '0';
      applyFrame(frameRightX(bounds), -1.1, 10);
      applyPanel(panelA, panelMidLeft(bounds), 0, -24);
      applyPanel(panelB, panelMidRight(bounds), 0, 24);
      applyPanel(panelC, panelThemeLeft(bounds), 0, -24);
      applyThemeParade(themeRightX(bounds), 0, 20);
      applyThemeFan(0);
      return;
    }

    if (raw < t.entry) {
      const p = easeOutQuint(raw / t.entry);
      const x = lerp(bounds.center - frameW / 2, frameRightX(bounds), p);
      const angle = lerp(-1.65, -1.05, p);
      const lift = lerp(20, 8, p);
      const scale = lerp(0.985, 1, easeOutCubic(raw / t.entry));
      const op = easeOutCubic(clamp(raw / (t.entry * 0.35), 0, 1));
      frameShell.style.opacity = String(op);
      applyFrame(x, angle, lift, scale);
      applyPanel(panelA, panelMidLeft(bounds), 0, -24);
      applyPanel(panelB, panelMidRight(bounds), 0, 24);
      applyPanel(panelC, panelThemeLeft(bounds), 0, -24);
      applyThemeParade(themeRightX(bounds), 0, 20);
      activateStep(0);
      return;
    }

    frameShell.style.opacity = '1';

    if (raw < t.aEnd) {
      applyFrame(frameRightX(bounds), -1.05, 0);
      const ap = clamp((raw - t.aStart) / (t.aEnd - t.aStart), 0, 1);
      const opA = easeOutCubic(clamp(ap * 2.5, 0, 1));
      applyPanel(panelA, panelMidLeft(bounds), opA, -18);
      applyPanel(panelB, panelMidRight(bounds), 0, 24);
      applyPanel(panelC, panelThemeLeft(bounds), 0, -24);
      applyThemeParade(themeRightX(bounds), 0, 20);
      trackFillA.style.transform = `scaleY(${clamp(ap * 1.02, 0, 1)})`;
      activateStep(clamp(Math.floor(ap * totalA), 0, totalA - 1));
      return;
    }

    if (raw < t.crossEnd) {
      const cp = clamp((raw - t.crossStart) / (t.crossEnd - t.crossStart), 0, 1);
      const fx = lerp(frameRightX(bounds), frameLeftX(bounds), easeInOutQuart(cp));
      applyFrame(fx, lerp(-1.05, 0.85, cp), 0);
      const opA = cp < 0.32 ? 1 : easeOutCubic(clamp(1 - (cp - 0.32) / 0.34, 0, 1));
      const opB = cp < 0.44 ? 0 : easeOutCubic((cp - 0.44) / 0.56);
      applyPanel(panelA, panelMidLeft(bounds), opA, -18);
      applyPanel(panelB, panelMidRight(bounds), opB, 18);
      applyPanel(panelC, panelThemeLeft(bounds), 0, -24);
      applyThemeParade(themeRightX(bounds), 0, 20);
      activateStep(cp < 0.5 ? totalA - 1 : totalA);
      return;
    }

    applyFrame(frameLeftX(bounds), 0.85, 0);
    if (raw < t.themeStart) {
      const bp = clamp((raw - t.bStart) / (t.bEnd - t.bStart), 0, 1);
      frameShell.style.opacity = '1';
      applyPanel(panelA, panelMidLeft(bounds), 0, -18);
      applyPanel(panelB, panelMidRight(bounds), 1, 18);
      applyPanel(panelC, panelThemeLeft(bounds), 0, -24);
      applyThemeParade(themeRightX(bounds), 0, 20);
      trackFillB.style.transform = `scaleY(${clamp(bp * 1.02, 0, 1)})`;
      activateStep(totalA + clamp(Math.floor(bp * totalB), 0, totalB - 1));
      return;
    }

    const themeP = clamp((raw - t.themeStart) / (t.themeEnd - t.themeStart), 0, 1);
    const fanP = clamp((themeP - 0.26) / 0.74, 0, 1);
    const enterTheme = easeOutCubic(clamp(themeP * 3.2, 0, 1));
    const exitFrame = easeOutCubic(clamp(themeP * 2.4, 0, 1));
    frameShell.style.opacity = String(1 - exitFrame);
    applyPanel(panelA, panelMidLeft(bounds), 0, -18);
    applyPanel(panelB, panelMidRight(bounds), clamp(1 - themeP * 4, 0, 1), 18);
    applyPanel(panelC, panelThemeLeft(bounds), enterTheme, -16);
    applyThemeParade(themeRightX(bounds), enterTheme, lerp(24, 0, enterTheme));
    trackFillC.style.transform = `scaleY(${clamp(fanP * 1.02, 0, 1)})`;
    applyThemeFan(fanP);
    activateStep(totalShots + clamp(Math.floor(themeP * totalC), 0, totalC - 1));
  }

  function schedule(scroll = latestScroll) {
    latestScroll = scroll;
    if (frameToken !== null) return;
    frameToken = requestAnimationFrame(() => {
      frameToken = null;
      tick(latestScroll);
    });
  }

  function activateStep(idx) {
    if (idx === currentStep) return;
    currentStep = idx;
    stepsA.forEach((el, i) => el.classList.toggle('active', idx < totalA && i === idx));
    stepsB.forEach((el, i) => el.classList.toggle('active', idx >= totalA && i === idx - totalA));
    stepsC.forEach((el, i) =>
      el.classList.toggle('active', idx >= totalShots && i === idx - totalShots),
    );
    shots.forEach((el, i) => el.classList.toggle('active', i === clamp(idx, 0, totalShots - 1)));
  }

  function skipShowcaseTo(target) {
    const y = pageY(target);
    const lenis = getLenis();
    skipUntil = performance.now() + 900;
    if (lenis?.scrollTo) {
      lenis.scrollTo(y, { immediate: true, force: true });
    } else {
      window.scrollTo({ top: y, behavior: 'auto' });
    }
    history.replaceState(null, '', `#${target.id}`);
    schedule(y);
  }

  function limitShowcaseWheel(event) {
    if (event.ctrlKey || performance.now() < skipUntil) return;
    const scroll = getLenis()?.scroll ?? window.scrollY;
    const raw = scroll - sectionStart;
    const t = timeline(window.innerHeight);
    if (raw < -40 || raw > t.exit) return;

    const delta = Math.abs(event.deltaY);
    const maxDelta = 190;
    if (delta <= maxDelta) return;

    event.preventDefault();
    const next = scroll + Math.sign(event.deltaY) * maxDelta;
    const lenis = getLenis();
    if (lenis?.scrollTo) {
      lenis.scrollTo(next, { duration: 0.62, force: true });
    } else {
      window.scrollTo({ top: next, behavior: 'smooth' });
    }
  }

  frameShell.style.opacity = '0';
  panelA.style.opacity = '0';
  panelB.style.opacity = '0';
  panelC.style.opacity = '0';
  themeParade.style.opacity = '0';
  hydrateThemeImages();

  measure();
  tick(window.scrollY);

  const attachLenis = (lenis) => lenis?.on?.('scroll', ({ scroll }) => schedule(scroll));
  attachLenis(getLenis());
  window.addEventListener('velocityui:lenis-ready', (event) => attachLenis(event.detail), {
    once: true,
  });
  window.addEventListener('scroll', () => schedule(getLenis()?.scroll ?? window.scrollY), {
    passive: true,
  });
  window.addEventListener('wheel', limitShowcaseWheel, { passive: false, capture: true });
  window.addEventListener(
    'resize',
    () => {
      measure();
      schedule(getLenis()?.scroll ?? window.scrollY);
    },
    { passive: true },
  );

  document.querySelectorAll('a[href="#features"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.getElementById('features');
      if (!target) return;
      event.preventDefault();
      skipShowcaseTo(target);
    });
  });

  if (location.hash === '#features') {
    requestAnimationFrame(() => {
      const target = document.getElementById('features');
      if (target) skipShowcaseTo(target);
    });
  }
}
