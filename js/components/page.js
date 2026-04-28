import './nav.js?v=landing-clean-21';
import './footer.js?v=landing-clean-21';

class VelocityPage extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute('title');
    const navActive = this.getAttribute('nav-active') ?? 'home';
    const navScrolled = this.hasAttribute('nav-scrolled');

    if (title) document.title = title;

    const tpl = this.querySelector('template');
    const nav = document.createElement('velocity-nav');
    const main = document.createElement('main');
    const footer = document.createElement('velocity-footer');

    nav.setAttribute('active', navActive);
    if (navScrolled) nav.setAttribute('scrolled', '');
    if (tpl) main.appendChild(tpl.content.cloneNode(true));

    this.replaceWith(nav, main, footer);
  }
}

customElements.define('velocity-page', VelocityPage);
