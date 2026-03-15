/* ============================================================
   Infinity Dental — cms-bridge.js
   Fetches _data/ JSON/MD files → injects into DOM
   ============================================================ */

// ── Base path helper ─────────────────────────────────────────
function basePath() {
  // Works locally and on Netlify
  const path = window.location.pathname;
  const depth = (path.match(/\//g) || []).length - 1;
  return depth > 0 ? '../'.repeat(depth) : './';
}

const BASE = basePath();

// ── Fetch helpers ─────────────────────────────────────────────
async function fetchJSON(path) {
  try {
    const res = await fetch(BASE + path);
    if (!res.ok) throw new Error(`Failed to fetch ${path}`);
    return await res.json();
  } catch (e) {
    console.warn('[cms-bridge]', e.message);
    return null;
  }
}

async function fetchText(path) {
  try {
    const res = await fetch(BASE + path);
    if (!res.ok) throw new Error(`Failed to fetch ${path}`);
    return await res.text();
  } catch (e) {
    console.warn('[cms-bridge]', e.message);
    return null;
  }
}

// ── Frontmatter parser ────────────────────────────────────────
function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };

  const meta = {};
  match[1].split('\n').forEach(line => {
    const [key, ...rest] = line.split(':');
    if (key && rest.length) {
      meta[key.trim()] = rest.join(':').trim().replace(/^"|"$/g, '');
    }
  });

  return { meta, body: match[2] };
}

// ── Stars render ──────────────────────────────────────────────
function renderStars(n) {
  return '★'.repeat(Math.max(0, Math.min(5, n)));
}

// ── Image fallback ────────────────────────────────────────────
function imgSrc(src, fallbackText = '🦷') {
  return `<img src="${src}" alt="${fallbackText}" loading="lazy"
          onerror="this.style.background='var(--ice)';this.src='';this.style.minHeight='200px';">`;
}

/* ============================================================
   PAGE: HOME (index.html)
   ── Injects: hero stats, services grid, doctor section
   ============================================================ */
async function loadHomePage() {
  const [site, services, gallery, reviews] = await Promise.all([
    fetchJSON('_data/site.json'),
    fetchJSON('_data/services.json'),
    fetchJSON('_data/gallery.json'),
    fetchJSON('_data/reviews.json')
  ]);
  if (!site) return;

  // Stats
  setTextById('hero-stat-years',    site.years_exp);
  setTextById('hero-stat-patients', site.patients);
  setTextById('hero-stat-rating',   site.rating + '★');

  // Doctor section
  setTextById('doctor-name',  site.doctor_name);
  setTextById('doctor-title', site.doctor_title);
  setTextById('doctor-bio',   site.doctor_bio);

  const doctorImg = document.getElementById('doctor-img');
  if (doctorImg) {
    doctorImg.src = site.doctor_photo;
    doctorImg.alt = site.doctor_name;
  }

  // Services grid
  if (services) {
    const grid = document.getElementById('services-grid');
    if (grid) {
      grid.innerHTML = services.slice(0, 8).map((s, i) => `
        <div class="service-card anim-fade-up anim-delay-${(i % 4) + 1}"
             data-category="${s.category}"
             onclick="window.location.href='services.html'">
          <div class="svc-icon">${s.icon}</div>
          <p class="svc-name">${s.name}</p>
          <p class="svc-desc">${s.short_desc}</p>
        </div>
      `).join('');
    }
  }

  // Before & After Gallery (Homepage)
  if (gallery) {
    const baGrid = document.getElementById('home-ba-grid');
    if (baGrid) {
      baGrid.innerHTML = gallery.slice(0, 2).map((item, i) => `
        <div class="ba-card anim-fade-up anim-delay-${i + 1}">
          <div class="ba-images">
            <div style="position:relative;width:50%;">
              <span class="ba-label before">BEFORE</span>
              ${imgSrc(item.before, 'Before ' + item.label)}
            </div>
            <div style="position:relative;width:50%;">
              <span class="ba-label after">AFTER</span>
              ${imgSrc(item.after, 'After ' + item.label)}
            </div>
          </div>
          <div class="ba-info">
            <h4>${item.label}</h4>
            <p>${item.category}</p>
          </div>
        </div>
      `).join('');
    }
  }

  // Testimonials (Homepage)
  if (reviews) {
    const testiGrid = document.getElementById('home-testi-grid');
    if (testiGrid) {
      testiGrid.innerHTML = reviews.slice(0, 3).map((r, i) => `
        <div class="testi-card anim-fade-up anim-delay-${i + 1}">
          <div class="stars">${renderStars(r.stars)}</div>
          <p class="testi-text">"${r.text}"</p>
          <div class="testi-author">
            <div class="testi-avatar">${r.name.charAt(0)}</div>
            <div>
              <p class="testi-name">${r.name}</p>
              <p style="font-size:0.8rem;color:var(--gray);">${r.date}</p>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  // Ticker
  buildTicker(site);

  // Stat counters
  setupStatCounters(site);
}

function buildTicker(site) {
  const items = [
    `🏅 ${site.years_exp} Years of Excellence`,
    `⭐ ${site.rating} Google Rating`,
    `✅ MCI Verified Implantologist`,
    `😁 ${site.patients} Happy Patients`,
    `🦷 ${site.treatments} Treatments Completed`,
    `📍 Vijay Nagar, Indore`,
    `📞 ${site.phone}`,
  ];
  const doubled = [...items, ...items];
  const track = document.getElementById('ticker-track');
  if (track) {
    track.innerHTML = doubled.map(item =>
      `<span class="ticker-item"><span class="ticker-dot"></span>${item}</span>`
    ).join('');
  }
}

function setupStatCounters(site) {
  const counters = {
    'stat-years':    { target: parseInt(site.years_exp), suffix: '+' },
    'stat-patients': { target: parseInt(site.patients),  suffix: '+' },
    'stat-services': { target: parseInt(site.services_count), suffix: '+' },
    'stat-rating':   { target: parseFloat(site.rating),  suffix: '★', decimal: true },
  };

  Object.entries(counters).forEach(([id, cfg]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.dataset.count   = cfg.target;
    el.dataset.suffix  = cfg.suffix;
    el.dataset.decimal = cfg.decimal || false;
  });
}

/* ============================================================
   PAGE: SERVICES (services.html)
   ============================================================ */
async function loadServicesPage() {
  const services = await fetchJSON('_data/services.json');
  if (!services) return;

  const grid   = document.getElementById('services-full-grid');
  const drawer = document.getElementById('service-drawer');
  const overlay = document.getElementById('drawer-overlay');

  if (!grid) return;

  grid.innerHTML = services.map(s => `
    <div class="service-full-card" data-category="${s.category}" data-id="${s.id}"
         onclick="openDrawer(${JSON.stringify(s).replace(/"/g, '&quot;')})">
      <div class="svc-full-icon">${s.icon}</div>
      <p class="svc-full-name">${s.name}</p>
      <p class="svc-full-desc">${s.short_desc}</p>
      <span class="svc-view-btn">View Details →</span>
    </div>
  `).join('');

  // Filter
  if (window.InfinityDental) {
    window.InfinityDental.initFilterTabs('#services-filters', '.service-full-card');
  }

  // Drawer logic
  window.openDrawer = function(s) {
    if (drawer) {
      document.getElementById('drawer-icon').textContent  = s.icon;
      document.getElementById('drawer-name').textContent  = s.name;
      document.getElementById('drawer-cat').textContent   = s.category;
      document.getElementById('drawer-desc').textContent  = s.desc;
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeDrawer = function() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (overlay) overlay.addEventListener('click', window.closeDrawer);
}

/* ============================================================
   PAGE: ABOUT (about.html)
   ============================================================ */
async function loadAboutPage() {
  const about = await fetchJSON('_data/about.json');
  if (!about) return;

  setTextById('about-name',      about.doctor_name);
  setTextById('about-degree',    about.degree + ', ' + about.specialization);
  setTextById('about-bio',       about.bio_full || about.bio_short);
  setTextById('about-quote',     '"' + about.quote + '"');

  const img = document.getElementById('about-img');
  if (img) { img.src = about.photo; img.alt = about.doctor_name; }

  // Specializations
  const specGrid = document.getElementById('spec-grid');
  if (specGrid && about.specializations) {
    specGrid.innerHTML = about.specializations.map(sp => `
      <div class="spec-item card" style="padding:24px;text-align:center;">
        <div style="font-size:2rem;margin-bottom:10px;">${sp.icon}</div>
        <p style="font-weight:600;color:var(--deep);font-size:0.92rem;">${sp.name}</p>
      </div>
    `).join('');
  }

  // Timeline
  const timeline = document.getElementById('about-timeline');
  if (timeline && about.timeline) {
    timeline.innerHTML = `<div class="timeline-list">` +
      about.timeline.map(item => `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <p class="year">${item.year}</p>
          <h4>${item.title}</h4>
          <p>${item.desc}</p>
        </div>
      `).join('') + `</div>`;
  }

  // Stats
  const statsWrap = document.getElementById('about-stats');
  if (statsWrap && about.stats) {
    statsWrap.innerHTML = about.stats.map(s => `
      <div class="stat-item">
        <p class="stat-num" data-count="${s.num}" data-suffix="${s.suffix}">0${s.suffix}</p>
        <p>${s.label}</p>
      </div>
    `).join('');
    if (window.InfinityDental) {
      // Re-init counters for dynamically added elements
      setTimeout(() => initCounters(), 100);
    }
  }
}

/* ============================================================
   PAGE: GALLERY (gallery.html)
   ============================================================ */
async function loadGalleryPage() {
  const gallery = await fetchJSON('_data/gallery.json');
  if (!gallery) return;

  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  let lightboxItems = [];

  grid.innerHTML = gallery.map((item, idx) => {
    lightboxItems.push(item);
    return `
      <div class="gallery-item" data-category="${item.category}" onclick="openLightbox(${idx})">
        <div class="gallery-compare">
          <div class="gallery-side">
            ${imgSrc(item.before, 'Before')}
            <span class="gallery-label">BEFORE</span>
          </div>
          <div class="gallery-side">
            ${imgSrc(item.after, 'After')}
            <span class="gallery-label" style="background:rgba(20,184,166,0.85);">AFTER</span>
          </div>
        </div>
        <div class="gallery-caption">
          <span>${item.label}</span>
          <span class="badge badge-sky" style="font-size:0.72rem;">${item.category}</span>
        </div>
      </div>
    `;
  }).join('');

  if (window.InfinityDental) {
    window.InfinityDental.initFilterTabs('#gallery-filters', '.gallery-item');
  }

  // Lightbox
  let currentIdx = 0;
  const lightbox    = document.getElementById('lightbox');
  const lbImg       = document.getElementById('lightbox-img');

  window.openLightbox = function(idx) {
    currentIdx = idx;
    if (lbImg) lbImg.src = lightboxItems[idx].after;
    if (lightbox) lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = function() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };

  window.lightboxNav = function(dir) {
    currentIdx = (currentIdx + dir + lightboxItems.length) % lightboxItems.length;
    if (lbImg) lbImg.src = lightboxItems[currentIdx].after;
  };

  if (lightbox) {
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) window.closeLightbox();
    });
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') window.closeLightbox();
      if (e.key === 'ArrowRight') window.lightboxNav(1);
      if (e.key === 'ArrowLeft') window.lightboxNav(-1);
    });
  }
}

/* ============================================================
   PAGE: REVIEWS (reviews.html)
   ============================================================ */
async function loadReviewsPage() {
  const reviews = await fetchJSON('_data/reviews.json');
  if (!reviews) return;

  const grid = document.getElementById('reviews-grid');
  if (!grid) return;

  let shown = 6;
  const loadMoreBtn = document.getElementById('load-more-reviews');

  function renderReviews() {
    grid.innerHTML = reviews.slice(0, shown).map(r => `
      <div class="review-card">
        <div class="stars">${renderStars(r.stars)}</div>
        <p class="review-text">"${r.text}"</p>
        <div class="reviewer">
          <div class="reviewer-avatar">${r.name.charAt(0)}</div>
          <div>
            <p class="reviewer-name">${r.name}</p>
            <p class="reviewer-date">${r.date}</p>
          </div>
        </div>
      </div>
    `).join('');

    if (loadMoreBtn) {
      loadMoreBtn.style.display = shown >= reviews.length ? 'none' : 'inline-flex';
    }
  }

  renderReviews();

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      shown += 3;
      renderReviews();
    });
  }
}

/* ============================================================
   PAGE: BLOG LIST (blog.html)
   Static list from JSON manifest or hard-coded posts
   ============================================================ */
const BLOG_POSTS = [
  {
    slug: '2025-03-10-dental-implant-signs',
    title: '5 Signs You Need a Dental Implant (And Why to Act Fast)',
    date: 'March 10, 2025',
    tag: 'Implants',
    thumbnail: 'images/blog/implant-guide.jpg',
    excerpt: 'Missing teeth affect more than just your smile. Here are the top warning signs that a dental implant might be your best option.',
  },
  {
    slug: '2025-02-18-whitening-guide',
    title: 'Teeth Whitening: In-Office vs At-Home — What Works Best?',
    date: 'February 18, 2025',
    tag: 'Cosmetic',
    thumbnail: 'images/blog/whitening-guide.jpg',
    excerpt: 'We compare professional laser whitening with DIY kits so you can make the best choice for your smile.',
  },
  {
    slug: '2025-01-05-implant-care-guide',
    title: 'How to Care for Your Dental Implant: A Complete Guide',
    date: 'January 5, 2025',
    tag: 'Implants',
    thumbnail: 'images/blog/implant-care.jpg',
    excerpt: 'A dental implant can last a lifetime with proper care. Follow these expert tips from Dr. Anmol Billore.',
  },
];

async function loadBlogPage() {
  const posts = BLOG_POSTS;

  // Featured
  const featured = document.getElementById('featured-post');
  if (featured && posts.length > 0) {
    const p = posts[0];
    featured.innerHTML = `
      <div class="featured-post-img">
        <img src="${p.thumbnail}" alt="${p.title}" style="width:100%;height:100%;min-height:320px;"
             onerror="this.style.background='var(--gradient)';this.src='';">
      </div>
      <div class="featured-post-content">
        <span class="post-tag">${p.tag}</span>
        <h2 class="blog-card-title" style="font-size:1.6rem;margin-bottom:12px;">${p.title}</h2>
        <p class="blog-excerpt">${p.excerpt}</p>
        <p class="blog-date" style="margin-bottom:20px;">${p.date}</p>
        <a href="blog-post.html?slug=${p.slug}" class="btn btn-primary">Read Article →</a>
      </div>
    `;
  }

  // Grid
  const grid = document.getElementById('blog-grid');
  if (grid && posts.length > 1) {
    grid.innerHTML = posts.slice(1).map(p => `
      <div class="blog-card">
        <div class="blog-card-img">
          <img src="${p.thumbnail}" alt="${p.title}"
               onerror="this.style.background='var(--gradient)';this.src='';">
        </div>
        <div class="blog-card-body">
          <div class="blog-meta">
            <span class="post-tag">${p.tag}</span>
            <span class="blog-date">${p.date}</span>
          </div>
          <p class="blog-card-title">${p.title}</p>
          <p class="blog-excerpt">${p.excerpt}</p>
          <a href="blog-post.html?slug=${p.slug}" class="read-more">Read More →</a>
        </div>
      </div>
    `).join('');
  }
}

/* ============================================================
   PAGE: BLOG POST (blog-post.html)
   ============================================================ */
async function loadBlogPost() {
  const params = new URLSearchParams(window.location.search);
  const slug   = params.get('slug') || BLOG_POSTS[0].slug;

  const raw = await fetchText(`_data/blog/${slug}.md`);
  if (!raw) {
    document.getElementById('post-body').innerHTML = '<p>Post not found.</p>';
    return;
  }

  const { meta, body } = parseFrontmatter(raw);

  setTextById('post-title',  meta.title || 'Blog Post');
  setTextById('post-tag',    meta.tag   || 'General');
  setTextById('post-date',   formatDate(meta.date));
  setTextById('post-author', 'Dr. Anmol Billore');

  document.title = (meta.title || 'Blog') + ' | Infinity Dental';

  const postBody = document.getElementById('post-body');
  if (postBody) {
    if (window.marked) {
      postBody.innerHTML = marked.parse(body);
    } else {
      // Basic fallback if marked.js isn't loaded yet
      postBody.innerHTML = `<p>${body.replace(/\n\n/g, '</p><p>')}</p>`;
    }
  }

  // Related posts
  const related = document.getElementById('related-grid');
  if (related) {
    related.innerHTML = BLOG_POSTS.filter(p => p.slug !== slug).slice(0, 3).map(p => `
      <div class="blog-card">
        <div class="blog-card-img">
          <img src="${p.thumbnail}" alt="${p.title}"
               onerror="this.style.background='var(--gradient)';this.src='';">
        </div>
        <div class="blog-card-body">
          <div class="blog-meta">
            <span class="post-tag">${p.tag}</span>
            <span class="blog-date">${p.date}</span>
          </div>
          <p class="blog-card-title">${p.title}</p>
          <a href="blog-post.html?slug=${p.slug}" class="read-more">Read More →</a>
        </div>
      </div>
    `).join('');
  }
}

/* ============================================================
   PAGE: CONTACT (contact.html)
   ============================================================ */
async function loadContactPage() {
  const site = await fetchJSON('_data/site.json');
  if (!site) return;

  setTextById('contact-phone',   site.phone);
  setTextById('contact-address', site.address);
  setTextById('contact-hours',   site.hours);

  const phoneLink = document.getElementById('contact-phone-link');
  if (phoneLink) phoneLink.href = `tel:+${site.phone_raw}`;

  const waBtn = document.getElementById('contact-wa-btn');
  if (waBtn) waBtn.href = site.wa_link;

  const mapWrap = document.getElementById('map-embed');
  if (mapWrap) {
    mapWrap.innerHTML = `<iframe
      src="${site.maps_embed}"
      width="100%" height="260" style="border:0;" allowfullscreen loading="lazy"
      referrerpolicy="no-referrer-when-downgrade" title="Infinity Dental Location"></iframe>`;
  }
}

/* ============================================================
   UTILITIES
   ============================================================ */
function setTextById(id, text) {
  const el = document.getElementById(id);
  if (el && text !== undefined) el.textContent = text;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function initCounters() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el     = entry.target;
        const target = parseFloat(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const isDecimal = el.dataset.decimal === 'true';
        let start = 0;
        const step = target / 80;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) {
            el.textContent = (isDecimal ? target.toFixed(1) : target) + suffix;
            clearInterval(timer);
          } else {
            el.textContent = (isDecimal ? start.toFixed(1) : Math.floor(start)) + suffix;
          }
        }, 20);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.25 });

  document.querySelectorAll('[data-count]').forEach(el => io.observe(el));
}

/* ============================================================
   AUTO DETECT & LOAD
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop() || 'index.html';

  if (page === 'index.html' || page === '')      loadHomePage();
  else if (page === 'services.html')             loadServicesPage();
  else if (page === 'about.html')                loadAboutPage();
  else if (page === 'gallery.html')              loadGalleryPage();
  else if (page === 'reviews.html')              loadReviewsPage();
  else if (page === 'blog.html')                 loadBlogPage();
  else if (page === 'blog-post.html')            loadBlogPost();
  else if (page === 'contact.html')              loadContactPage();
});
