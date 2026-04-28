export function initHeroStage() {
  const stage = document.querySelector('.hero-stage');
  const image = document.querySelector('.hero-stage-image');

  if (!stage || !image) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let frame = null;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  const render = () => {
    frame = null;
    currentX += (targetX - currentX) * 0.16;
    currentY += (targetY - currentY) * 0.16;
    image.style.transform = `perspective(900px) rotateX(${currentY.toFixed(3)}deg) rotateY(${currentX.toFixed(3)}deg) rotateZ(-0.28deg)`;

    if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
      frame = requestAnimationFrame(render);
    }
  };

  const schedule = () => {
    if (frame === null) frame = requestAnimationFrame(render);
  };

  stage.addEventListener(
    'pointermove',
    (event) => {
      const rect = stage.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      targetX = px * 6.24;
      targetY = py * -4.32;
      schedule();
    },
    { passive: true },
  );

  stage.addEventListener(
    'pointerleave',
    () => {
      targetX = 0;
      targetY = 0;
      schedule();
    },
    { passive: true },
  );
}
