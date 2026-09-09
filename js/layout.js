/**
 * Shared layout — injects navbar & footer on every page with accurate cross-page links.
 */
(function () {
  'use strict';

  const PAGES = [
    { href: 'index.html', label: 'Home', id: 'home' },
    { href: 'about.html', label: 'About', id: 'about' },
    { href: 'services.html', label: 'Services', id: 'services' },
    { href: 'gallery.html', label: 'Results', id: 'gallery' },
    { href: 'team.html', label: 'Doctors', id: 'team' },
    { href: 'reviews.html', label: 'Reviews', id: 'reviews' },
    { href: 'contact.html', label: 'Contact', id: 'contact' },
  ];

  const currentPage = document.body.dataset.page || 'home';
  const isHome = currentPage === 'home';

  /* Inject eye-catching fonts site-wide */
  if (!document.getElementById('reva-fonts')) {
    const fontLink = document.createElement('link');
    fontLink.id = 'reva-fonts';
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap';
    document.head.appendChild(fontLink);
  }

  function navLinksHtml() {
    return PAGES.map((page) => {
      const active = page.id === currentPage ? ' active' : '';
      const ariaCurrent = page.id === currentPage ? ' aria-current="page"' : '';
      return `<li><a href="${page.href}" class="nav-link${active}"${ariaCurrent}>${page.label}</a></li>`;
    }).join('');
  }

  function footerLinksHtml() {
    return PAGES.filter((p) => p.id !== 'home' && p.id !== 'contact').map((page) => {
      return `<li><a href="${page.href}">${page.label === 'Doctors' ? 'Our Doctors' : page.label}</a></li>`;
    }).join('') + `<li><a href="contact.html">Book Appointment</a></li>`;
  }

  const navbarClass = isHome ? 'navbar' : 'navbar navbar--inner';

  const navbarHtml = `
    <header class="${navbarClass}" id="navbar" role="banner">
      <div class="container navbar__inner">
        <a href="index.html" class="navbar__logo" aria-label="REVA Skin and Hair Clinic — Home">
          
          <span class="navbar__logo-text">REVA <small>Skin & Hair</small></span>
        </a>
        <button class="navbar__toggle" id="navToggle" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="navMenu">
          <span></span><span></span><span></span>
        </button>
        <nav class="navbar__menu" id="navMenu" role="navigation" aria-label="Main navigation">
          <ul class="navbar__links">
            ${navLinksHtml()}
          </ul>
          <a href="contact.html" class="btn btn--primary btn--sm navbar__cta">Book Appointment</a>
        </nav>
      </div>
    </header>`;

  const footerHtml = `
    <footer class="footer" role="contentinfo">
      <div class="container footer__grid">
        <div class="footer__brand">
          <a href="index.html" class="footer__logo" aria-label="REVA Skin and Hair Clinic — Home">REVA <small>Skin & Hair</small></a>
          <p>Advanced dermatology and hair care you can trust. Science-backed treatments, compassionate care.</p>
          <div class="footer__social" aria-label="Social media links">
            <a href="#" aria-label="Follow REVA on Facebook">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M18 10a8 8 0 10-9.25 7.9v-5.6H6.5V10h2.25V8.02c0-2.22 1.32-3.45 3.33-3.45.96 0 1.96.17 1.96.17v2.16h-1.1c-1.09 0-1.43.67-1.43 1.36V10h2.43l-.39 2.3H12.5v5.6A8 8 0 0018 10z"/></svg>
            </a>
            <a href="#" aria-label="Follow REVA on Instagram">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M10 1.8c2.67 0 2.99.01 4.04.06 1.05.05 1.79.22 2.42.47.66.26 1.22.6 1.78 1.16.56.56.9 1.12 1.16 1.78.25.63.42 1.37.47 2.42.05 1.05.06 1.37.06 4.04s-.01 2.99-.06 4.04c-.05 1.05-.22 1.79-.47 2.42a4.93 4.93 0 01-1.16 1.78 4.93 4.93 0 01-1.78 1.16c-.63.25-1.37.42-2.42.47-1.05.05-1.37.06-4.04.06s-2.99-.01-4.04-.06c-1.05-.05-1.79-.22-2.42-.47a4.93 4.93 0 01-1.78-1.16 4.93 4.93 0 01-1.16-1.78c-.25-.63-.42-1.37-.47-2.42-.05-1.05-.06-1.37-.06-4.04s.01-2.99.06-4.04c.05-1.05.22-1.79.47-2.42a4.93 4.93 0 011.16-1.78 4.93 4.93 0 011.78-1.16c.63-.25 1.37-.42 2.42-.47 1.05-.05 1.37-.06 4.04-.06zM10 0C7.28 0 6.94.01 5.87.06 4.8.11 4.02.3 3.33.57a6.93 6.93 0 00-2.5 1.63A6.93 6.93 0 00.57 3.33C.3 4.02.11 4.8.06 5.87.01 6.94 0 7.28 0 10s.01 3.06.06 4.13c.05 1.07.24 1.85.51 2.54a6.93 6.93 0 001.63 2.5 6.93 6.93 0 002.5 1.63c.69.27 1.47.46 2.54.51C6.94 19.99 7.28 20 10 20s3.06-.01 4.13-.06c1.07-.05 1.85-.24 2.54-.51a6.93 6.93 0 002.5-1.63 6.93 6.93 0 001.63-2.5c.27-.69.46-1.47.51-2.54.05-1.07.06-1.41.06-4.13s-.01-3.06-.06-4.13c-.05-1.07-.24-1.85-.51-2.54a6.93 6.93 0 00-1.63-2.5 6.93 6.93 0 00-2.5-1.63C15.98.3 15.2.11 14.13.06 13.06.01 12.72 0 10 0zm0 4.86A5.14 5.14 0 1015.14 10 5.14 5.14 0 0010 4.86zm0 8.48A3.34 3.34 0 1113.34 10 3.34 3.34 0 0110 13.34zM15.67 4.69a1.2 1.2 0 11-1.2-1.2 1.2 1.2 0 011.2 1.2z"/></svg>
            </a>
            <a href="#" aria-label="Follow REVA on LinkedIn">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M18.5 0h-17A1.5 1.5 0 000 1.5v17A1.5 1.5 0 001.5 20h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0018.5 0zM6 17H3V8h3v9zM4.5 6.75A1.75 1.75 0 116.25 5 1.75 1.75 0 014.5 6.75zM17 17h-3v-4.5c0-1.07-.02-2.45-1.49-2.45-1.49 0-1.72 1.16-1.72 2.36V17H8v-9h2.88v1.23h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59V17z"/></svg>
            </a>
          </div>
        </div>
        <nav class="footer__nav" aria-label="Footer navigation">
          <h3>Quick Links</h3>
          <ul>${footerLinksHtml()}</ul>
        </nav>
        <div class="footer__contact">
          <h3>Contact</h3>
          <p><a href="tel:+977 9749717175">+977 9749717175</a></p>
          <p><a href="mailto:hello@revaclinic.com">hello@revaclinic.com</a></p>
        </div>
      </div>
      <div class="footer__bottom container">
        <p>&copy; 2026 REVA Skin &amp; Hair Clinic. All rights reserved.</p>
        <p><a href="#">Privacy Policy</a> · <a href="#">Terms of Service</a></p>
      </div>
    </footer>`;

  const headerEl = document.getElementById('site-header');
  const footerEl = document.getElementById('site-footer');

  if (headerEl) headerEl.innerHTML = navbarHtml;
  if (footerEl) footerEl.innerHTML = footerHtml;

  if (!isHome) {
    document.body.classList.add('page-inner');
  }
})();
