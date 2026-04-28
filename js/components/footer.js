const ROOT = new URL('../../', import.meta.url).href;

class VelocityFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="footer">
        <div class="wrap footer-inner">
          <div class="footer-brand">
            <a class="footer-logo" href="${ROOT}">
              <span class="footer-logo-v"></span>
              Velocity
            </a>
            <p class="footer-tagline">Monaco-powered UI for Roblox script executors on macOS.</p>
          </div>
          <div class="footer-cols">
            <div class="footer-col">
              <span class="footer-col-head">Product</span>
              <a class="footer-link" href="${ROOT}pages/install.html">Install</a>
              <a class="footer-link" href="${ROOT}pages/tutorials.html">Tutorials</a>
            </div>
            <div class="footer-col">
              <span class="footer-col-head">Links</span>
              <a class="footer-link" href="https://github.com/dawnpetal/Velocity" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a class="footer-link" href="https://github.com/dawnpetal/Velocity/releases" target="_blank" rel="noopener noreferrer">Releases</a>
              <a class="footer-link" href="https://github.com/dawnpetal/Velocity/issues" target="_blank" rel="noopener noreferrer">Issues</a>
            </div>
          </div>
        </div>
        <div class="wrap footer-legal">Not affiliated with Roblox Corporation. For educational purposes only.</div>
      </footer>`;
  }
}

customElements.define('velocity-footer', VelocityFooter);
