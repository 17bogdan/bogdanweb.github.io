/* ============================================================
   Shared Components — Aqua Hotel
   Injects Navbar, Footer into every page
   ============================================================ */

const NAVBAR_HTML = `
<nav class="navbar" id="navbar">
  <div class="container">
    <div class="navbar__inner">

      <!-- Logo -->
      <a href="index.html" class="navbar__logo" aria-label="Aqua Hotel — Acasă">
        <img src="img/logo.svg" alt="Aqua Hotel &amp; Restaurant" class="navbar__logo-img"/>
      </a>

      <!-- Desktop Menu -->
      <ul class="navbar__menu">
        <li><a href="index.html"      class="navbar__link">Acasă</a></li>
        <li><a href="camere.html"     class="navbar__link">Camere</a></li>
        <li><a href="restaurant.html" class="navbar__link">Restaurant</a></li>
        <li><a href="galerie.html"    class="navbar__link">Galerie</a></li>
        <li><a href="despre.html"     class="navbar__link">Despre</a></li>
        <li><a href="contact.html"    class="navbar__link">Contact</a></li>
      </ul>

      <!-- Right Actions -->
      <div class="navbar__right">
        <a href="tel:+40743222211" class="navbar__tel">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
          +40 743 222 211
        </a>
        <a href="camere.html" class="btn btn--primary btn--sm">
          <span>Rezervă</span>
        </a>
        <button class="navbar__burger" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>

    </div>
  </div>
</nav>

<!-- Mobile Menu -->
<div class="navbar__mobile">
  <a href="index.html"      class="navbar__mobile-link">Acasă</a>
  <a href="camere.html"     class="navbar__mobile-link">Camere</a>
  <a href="restaurant.html" class="navbar__mobile-link">Restaurant</a>
  <a href="galerie.html"    class="navbar__mobile-link">Galerie</a>
  <a href="despre.html"     class="navbar__mobile-link">Despre</a>
  <a href="contact.html"    class="navbar__mobile-link">Contact</a>
  <a href="camere.html"     class="btn btn--primary btn--lg" style="margin-top:2rem">Rezervă acum</a>
</div>
`;

const FOOTER_HTML = `
<footer class="footer">
  <div class="container">
    <div class="footer__grid">

      <!-- Brand -->
      <div class="footer__brand">
        <a href="index.html" class="navbar__logo footer__logo-link" aria-label="Aqua Hotel — Acasă">
          <img src="img/logo.svg" alt="Aqua Hotel &amp; Restaurant" class="navbar__logo-img footer__logo-img"/>
        </a>
        <p>Hotel de 3 stele în inima Târgu-Jiului, cu 15 camere moderne, restaurant și cafenea. Confort autentic la prețuri accesibile.</p>
        <div class="footer__social" style="margin-top:1.5rem">
          <a href="#" class="social-btn" aria-label="Facebook">
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
          </a>
          <a href="#" class="social-btn" aria-label="Instagram">
            <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </a>
          <a href="#" class="social-btn" aria-label="TripAdvisor">
            <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><circle cx="6.5" cy="14.5" r="2.5"/><circle cx="17.5" cy="14.5" r="2.5"/><path d="M12 3C7 3 2 7 2 12M12 3c5 0 10 4 10 9M12 3l-2 4M12 3l2 4"/></svg>
          </a>
        </div>
      </div>

      <!-- Nav Links -->
      <div>
        <p class="footer__col-title">Navigare</p>
        <ul class="footer__links">
          <li><a href="index.html"      class="footer__link">→ Acasă</a></li>
          <li><a href="camere.html"     class="footer__link">→ Camere</a></li>
          <li><a href="restaurant.html" class="footer__link">→ Restaurant</a></li>
          <li><a href="galerie.html"    class="footer__link">→ Galerie</a></li>
          <li><a href="despre.html"     class="footer__link">→ Despre noi</a></li>
          <li><a href="contact.html"    class="footer__link">→ Contact</a></li>
        </ul>
      </div>

      <!-- Services -->
      <div>
        <p class="footer__col-title">Servicii</p>
        <ul class="footer__links">
          <li><span class="footer__link">→ Mic dejun inclus</span></li>
          <li><span class="footer__link">→ Parcare supravegheată</span></li>
          <li><span class="footer__link">→ Wi-Fi gratuit</span></li>
          <li><span class="footer__link">→ Room service</span></li>
          <li><span class="footer__link">→ Servicii trezire</span></li>
          <li><span class="footer__link">→ Comandă Taxi</span></li>
        </ul>
      </div>

      <!-- Contact -->
      <div>
        <p class="footer__col-title">Contact</p>
        <div class="footer__contact-item">
          <span class="footer__contact-icon">📍</span>
          <span class="footer__contact-text">Str. Republicii, nr. 19A<br>Târgu-Jiu, Gorj</span>
        </div>
        <div class="footer__contact-item">
          <span class="footer__contact-icon">📞</span>
          <span class="footer__contact-text">
            <a href="tel:+40743222211" style="color:inherit">+40 743 222 211</a><br>
            <a href="tel:0253222614"   style="color:inherit">0253 222 614</a>
          </span>
        </div>
        <div class="footer__contact-item">
          <span class="footer__contact-icon">✉️</span>
          <span class="footer__contact-text">
            <a href="mailto:receptie@aquahotel.ro" style="color:inherit">receptie@aquahotel.ro</a>
          </span>
        </div>
      </div>

    </div>

    <div class="footer__bottom">
      <p class="footer__copy">© 2026 Aqua Hotel Târgu-Jiu. Toate drepturile rezervate.</p>
      <div style="display:flex;gap:1.5rem">
        <a href="#" style="font-size:0.75rem;color:var(--c-text-muted)">Politica de confidențialitate</a>
        <a href="#" style="font-size:0.75rem;color:var(--c-text-muted)">Termeni și condiții</a>
      </div>
    </div>
  </div>
</footer>
`;

const CURSOR_HTML = `
<div class="cursor-outer" aria-hidden="true"></div>
<div class="cursor-inner" aria-hidden="true"></div>
`;

const LOADER_HTML = `
<div class="loader" id="page-loader">
  <div class="loader__logo">
    <img src="img/logo.svg" alt="Aqua Hotel" style="height:56px;width:auto;filter:drop-shadow(0 0 14px rgba(201,168,76,0.45))"/>
  </div>
  <div class="loader__bar"></div>
  <div class="loader__percent">0%</div>
</div>
`;

// Inject on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Cursor
  document.body.insertAdjacentHTML('afterbegin', CURSOR_HTML);

  // Loader
  document.body.insertAdjacentHTML('afterbegin', LOADER_HTML);

  // Navbar
  const navSlot = document.getElementById('navbar-slot');
  if (navSlot) navSlot.outerHTML = NAVBAR_HTML;

  // Footer
  const footerSlot = document.getElementById('footer-slot');
  if (footerSlot) footerSlot.outerHTML = FOOTER_HTML;
});
