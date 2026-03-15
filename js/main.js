/* ============================================================
   Infinity Dental — main.js
   Shared utilities: Nav, Footer, Hamburger, Animations, Toasts
   ============================================================ */

// ── Constants ────────────────────────────────────────────────
const WA_LINK   = 'https://wa.me/91XXXXXXXXXX';
const WA_TEXT   = encodeURIComponent('Hello! I\'d like to book an appointment at Infinity Dental Clinic.');
const BOOK_LINK = 'contact.html#appointment';

const NAV_LINKS = [
  { label: 'Home',     href: 'index.html' },
  { label: 'Services', href: 'services.html' },
  { label: 'About',    href: 'about.html' },
  { label: 'Gallery',  href: 'gallery.html' },
  { label: 'Reviews',  href: 'reviews.html' },
  { label: 'Blog',     href: 'blog.html' },
  { label: 'Contact',  href: 'contact.html' },
];

// ── Active Link Detection ─────────────────────────────────────
function getActivePage() {
  const path = window.location.pathname;
  const file = path.split('/').pop() || 'index.html';
  return file;
}

// ── Build Nav HTML ────────────────────────────────────────────
function buildNav() {
  const activePage = getActivePage();

  const linksHTML = NAV_LINKS.map(l => {
    const isActive = l.href === activePage || (activePage === '' && l.href === 'index.html');
    return `<a href="${l.href}" class="${isActive ? 'active' : ''}">${l.label}</a>`;
  }).join('');

  const drawerLinksHTML = NAV_LINKS.map(l => `<a href="${l.href}">${l.label}</a>`).join('');

  return `
    <nav id="main-nav" role="navigation" aria-label="Main navigation">
      <div class="nav-inner">
        <a href="index.html" class="nav-logo" id="nav-logo">
          <div class="nav-logo-icon">🦷</div>
          <span>Infinity Dental</span>
        </a>
        <div class="nav-links" id="nav-links">
          ${linksHTML}
        </div>
        <div class="nav-actions">
          <a href="contact.html" class="btn btn-ghost" id="nav-visit-btn">Visit Us</a>
          <a href="${BOOK_LINK}" class="btn btn-primary" id="nav-book-btn">Book Appointment</a>
        </div>
        <button class="hamburger" id="hamburger-btn" aria-label="Toggle menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
    <div class="nav-drawer" id="nav-drawer" aria-hidden="true">
      ${drawerLinksHTML}
      <div class="drawer-divider"></div>
      <a href="${BOOK_LINK}" class="btn btn-primary">📅 Book Appointment</a>
      <a href="${WA_LINK}?text=${WA_TEXT}" target="_blank" rel="noopener" class="btn btn-whatsapp">💬 WhatsApp Us</a>
    </div>
  `;
}

// ── Build Footer HTML ─────────────────────────────────────────
function buildFooter() {
  const year = new Date().getFullYear();
  return `
    <footer id="main-footer" role="contentinfo">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="footer-logo">
              <div class="footer-logo-icon">🦷</div>
              <span>Infinity Dental</span>
            </div>
            <p>Your trusted dental care partner in Indore. Dr. Anmol Billore provides world-class implantology and cosmetic dentistry with compassionate care.</p>
          </div>
          <div>
            <p class="footer-heading">Core Services</p>
            <ul class="footer-links">
              <li><a href="services.html">Dental Implants</a></li>
              <li><a href="services.html">Smile Makeover</a></li>
              <li><a href="services.html">Root Canal (RCT)</a></li>
              <li><a href="services.html">Braces & Aligners</a></li>
              <li><a href="services.html">Teeth Whitening</a></li>
              <li><a href="services.html">Crowns & Bridges</a></li>
            </ul>
          </div>
          <div>
            <p class="footer-heading">Quick Links</p>
            <ul class="footer-links">
              <li><a href="index.html">Home</a></li>
              <li><a href="about.html">About Dr. Anmol</a></li>
              <li><a href="gallery.html">Gallery</a></li>
              <li><a href="reviews.html">Patient Reviews</a></li>
              <li><a href="blog.html">Blog</a></li>
              <li><a href="contact.html">Contact Us</a></li>
            </ul>
          </div>
          
          <div>
            <p class="footer-heading">Address</p>
            <address style="font-style: normal; line-height: 1.6; margin-bottom: 16px;">
              Infinity Dental Clinic<br>
              34, Scheme No. 54, Vijay Nagar<br>
              Indore, Madhya Pradesh — 452 010<br>
              <a href="tel:+91XXXXXXXXXX">+91 XXXXXXXXXX</a><br>
              <a href="https://maps.google.com/?q=..." target="_blank" rel="noopener">
                View on Google Maps ↗
              </a>
            </address>
            <div class="clinic-hours" style="margin-top: 20px;">
              <p class="footer-heading">Clinic Hours</p>
              <table style="width: 100%; font-size: 0.9em; line-height: 1.5;">
                <tr><td>Monday – Saturday</td><td style="text-align: right;">9:00 AM – 1:00 PM</td></tr>
                <tr><td>Monday – Saturday</td><td style="text-align: right;">5:00 PM – 9:00 PM</td></tr>
                <tr><td>Sunday</td><td style="text-align: right;">10:00 AM – 1:00 PM</td></tr>
              </table>
            </div>
          </div>

            <div class="footer-contact-item">
              <span class="footer-contact-icon">📞</span>
              <a href="tel:+91XXXXXXXXXX" style="color:inherit">+91 XXXXXXXXXX</a>
            </div>
            <div class="footer-contact-item">
              <span class="footer-contact-icon">🕐</span>
              <span>10AM–2PM &amp; 5PM–9PM<br>Mon–Sun (All Days)</span>
            </div>
            <a href="${WA_LINK}?text=${WA_TEXT}" target="_blank" rel="noopener"
               class="btn btn-whatsapp mt-16" style="font-size:0.82rem;padding:10px 18px;display:inline-flex;">
              💬 Chat on WhatsApp
            </a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© ${year} Infinity Dental Clinic. All rights reserved. | <a href="privacy-policy.html" style="color: inherit; text-decoration: underline;">Privacy Policy</a></span>
          <span>Dr. Anmol Billore — BDS, Implantologist · MCI Verified</span>
        </div>
      </div>
    </footer>

    <!-- Floating WhatsApp Button -->
    <a href="${WA_LINK}?text=${WA_TEXT}" target="_blank" rel="noopener"
       class="whatsapp-float" id="whatsapp-float" aria-label="Chat on WhatsApp">
      💬
    </a>
  `;
}

// ── Inject Nav + Footer ───────────────────────────────────────
function injectLayout() {
  // Nav
  const navPlaceholder = document.getElementById('nav-placeholder');
  if (navPlaceholder) {
    navPlaceholder.outerHTML = buildNav();
  } else {
    document.body.insertAdjacentHTML('afterbegin', buildNav());
    document.body.insertAdjacentHTML('afterbegin', '<a href="#main-content" class="skip-link">Skip to main content</a>');
  }

  // Footer
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    footerPlaceholder.outerHTML = buildFooter();
  } else {
    document.body.insertAdjacentHTML('beforeend', buildFooter());
  }
}

// ── Hamburger Toggle ──────────────────────────────────────────
function initHamburger() {
  const btn    = document.getElementById('hamburger-btn');
  const drawer = document.getElementById('nav-drawer');
  if (!btn || !drawer) return;

  btn.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('open');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
    drawer.setAttribute('aria-hidden', !isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', false);
      drawer.setAttribute('aria-hidden', true);
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !drawer.contains(e.target)) {
      drawer.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', false);
      document.body.style.overflow = '';
    }
  });
}

// ── Nav scroll effect ─────────────────────────────────────────
function initNavScroll() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// ── Intersection Observer (Fade-in on scroll) ─────────────────
function initScrollAnimations() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.anim-fade-up').forEach(el => {
    el.style.animationPlayState = 'paused';
    io.observe(el);
  });
}

// ── Counter animation ─────────────────────────────────────────
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = el.dataset.suffix ? target + el.dataset.suffix : target;
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(start) + (el.dataset.suffix || '');
    }
  }, 16);
}

function initCounters() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        animateCounter(el, target);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('[data-count]').forEach(el => io.observe(el));
}

// ── Toast Utility ─────────────────────────────────────────────
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ── Filter Tabs utility ───────────────────────────────────────
function initFilterTabs(containerSelector, cardSelector, dataAttr = 'data-category') {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  container.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      container.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      document.querySelectorAll(cardSelector).forEach(card => {
        const cat = card.getAttribute(dataAttr);
        if (filter === 'all' || cat === filter) {
          card.style.display = '';
          card.classList.remove('hidden');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ── Hash scrolling for #appointment ──────────────────────────
function initHashScroll() {
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 350);
    }
  }
}

// ── Image fallback ────────────────────────────────────────────
function initImageFallbacks() {
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function () {
      this.src = '';
      this.style.background = 'var(--ice)';
      this.style.minHeight = '200px';
      this.alt = '🦷';
    });
  });
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  injectLayout();
  initHamburger();
  initNavScroll();
  initScrollAnimations();
  initCounters();
  initHashScroll();
  initImageFallbacks();
});

// Export utilities for other scripts
window.InfinityDental = {
  WA_LINK,
  WA_TEXT,
  showToast,
  initFilterTabs,
  animateCounter,
};
