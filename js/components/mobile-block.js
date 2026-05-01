export function blockMobile() {
  const ua = navigator.userAgent;
  const isTouchOnly = navigator.maxTouchPoints > 1 && !window.matchMedia('(pointer:fine)').matches;
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

  if (!isTouchOnly && !isMobileUA) return;

  document.documentElement.style.overflow = 'hidden';

  const style = document.createElement('style');
  style.textContent = `
    #mobile-block {
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: #0a0b0d;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      font-family: 'Manrope', system-ui, sans-serif;
    }
    .mb-inner {
      max-width: 340px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .mb-icon-wrap {
      width: 72px;
      height: 72px;
      border-radius: 20px;
      background: rgba(79, 142, 247, 0.08);
      border: 1px solid rgba(79, 142, 247, 0.18);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 2rem;
    }
    .mb-icon {
      width: 32px;
      height: 32px;
      color: #4f8ef7;
    }
    .mb-kicker {
      font-size: .68rem;
      font-weight: 700;
      letter-spacing: .14em;
      text-transform: uppercase;
      color: #4f8ef7;
      margin: 0 0 .85rem;
    }
    .mb-headline {
      font-size: 1.75rem;
      font-weight: 800;
      line-height: 1.15;
      color: #fff;
      margin: 0 0 1rem;
      letter-spacing: -.02em;
    }
    .mb-divider {
      width: 32px;
      height: 2px;
      background: rgba(79, 142, 247, 0.35);
      border-radius: 2px;
      margin: 0 auto 1rem;
    }
    .mb-sub {
      font-size: .875rem;
      line-height: 1.65;
      color: rgba(255, 255, 255, .38);
      margin: 0;
    }
  `;
  document.head.appendChild(style);

  const overlay = document.createElement('div');
  overlay.id = 'mobile-block';
  overlay.innerHTML = `
    <div class="mb-inner">
      <div class="mb-icon-wrap">
        <svg class="mb-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" stroke-width="1.5"/>
          <path d="M8 21h8M12 17v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>
      <p class="mb-kicker">Desktop Only</p>
      <h1 class="mb-headline">VelocityUI is built for desktop.</h1>
      <div class="mb-divider"></div>
      <p class="mb-sub">This site is best experienced on a Mac or PC. Please revisit on a desktop browser.</p>
    </div>
  `;

  const mount = () => document.body.insertBefore(overlay, document.body.firstChild);
  document.body ? mount() : document.addEventListener('DOMContentLoaded', mount);
}
