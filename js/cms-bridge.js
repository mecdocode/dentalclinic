
/* ============================================================
   ROOT CAUSE FIX: LOCAL STATIC DATA (No silent fetch failures)
   ============================================================ */
const STATIC_SERVICES = [
  { id: "s1", title: "Dental Implants", category: "Implants", icon: "🦷", short_desc: "Permanent tooth replacement with expert precision.", desc: "Dental implants are the gold standard for replacing missing teeth. Dr. Anmol uses advanced surgical protocols to ensure 100% painless and life-long results.", price: "Premium", duration: "1.5 Hrs" },
  { id: "s2", title: "Smile Makeover", category: "Cosmetic", icon: "✨", short_desc: "Transform your smile with cosmetic excellence.", desc: "A combination of veneers, whitening, and contouring to give you a Hollywood smile that boosts your confidence and matches your face perfectly.", price: "Premium", duration: "2 Hrs" },
  { id: "s3", title: "Invisible Aligners", category: "Cosmetic", icon: "💎", short_desc: "Straighten teeth discreetly without metal wires.", desc: "Clear aligners are nearly invisible and removable, making them perfect for adults who want a straighter smile without the hassle of traditional braces.", price: "Advanced", duration: "1 Hr" },
  { id: "s4", title: "Single-Sitting RCT", category: "Restorative", icon: "⚡", short_desc: "Painless root canal treatment in just one visit.", desc: "Advanced technology allows us to complete most root canal treatments in a single session, saving you time and minimizing discomfort.", price: "Standard", duration: "45 Mins" },
  { id: "s5", title: "Wisdom Tooth Surgery", category: "Restorative", icon: "🏥", short_desc: "Expert surgical extraction with minimal downtime.", desc: "Safe and precise removal of impacted wisdom teeth using minimally invasive techniques to ensure fast healing.", price: "Standard", duration: "30 Mins" },
  { id: "s6", title: "Teeth Whitening", category: "Cosmetic", icon: "🌟", short_desc: "Brighten your smile in less than 45 minutes.", desc: "Professional laser teeth whitening that is safe for your enamel and delivers shades of improvement in a single session.", price: "Standard", duration: "45 Mins" },
  { id: "s7", title: "Crowns & Bridges", category: "Restorative", icon: "🛡️", short_desc: "Durable and natural-looking tooth restorations.", desc: "We use high-quality Zirconia and E-max ceramic materials for dental crowns that are virtually indistinguishable from natural teeth.", price: "Advanced", duration: "45 Mins" },
  { id: "s8", title: "Pediatric Dentistry", category: "Preventive", icon: "🧸", short_desc: "Gentle dental care for your little ones.", desc: "A kid-friendly environment and specialized care to ensure your child develops healthy dental habits early in life.", price: "Standard", duration: "30 Mins" }
];

// Extend for 25 items
for(let i=9; i<=25; i++) {
  const cats = ["Implants", "Cosmetic", "Restorative", "Preventive"];
  STATIC_SERVICES.push({
    id: "s" + i,
    title: "Specialized Treatment Option " + i,
    category: cats[i % 4],
    icon: "🔬",
    short_desc: "Advanced procedure to optimize your oral health.",
    desc: "Complete pre-screen assessments and surgical configurations flawlessly provided inside clinic standards.",
    price: "Standard",
    duration: "45 Mins"
  });
}

const STATIC_GALLERY = [
  { title: "Smile Makeover", category: "Cosmetic", before: "/images/image2.jpeg", after: "/images/screen.png" },
  { title: "Dental Implants", category: "Implants", before: "/images/image2.jpeg", after: "/images/screen.png" },
  { title: "Invisible Aligners", category: "Cosmetic", before: "/images/image2.jpeg", after: "/images/screen.png" },
  { title: "Teeth Whitening", category: "Cosmetic", before: "/images/image2.jpeg", after: "/images/screen.png" },
  { title: "Composite Bonding", category: "Cosmetic", before: "/images/image2.jpeg", after: "/images/screen.png" },
  { title: "Overdenture Support", category: "Implants", before: "/images/image2.jpeg", after: "/images/screen.png" }
];

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

// ── Netlify Image CDN Optimizer ──────────────────────────────
function optimizeImage(src, width, height) {
  if (!src) return '/images/placeholder.jpg';
  // Check if it's an external absolute URL. If so, don't break it, just return it.
  if (src.startsWith('http')) return src;
  
  // Netlify transforms on the fly
  return `/.netlify/images?url=${encodeURIComponent(src)}&w=${width}&h=${height}&fit=cover&fm=webp`;
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
  return `<img src="${optimizeImage(src, 800, 600)}" alt="${fallbackText}" loading="lazy"
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
    doctorImg.src = optimizeImage(site.doctor_photo, 800, 1000);
    doctorImg.alt = site.doctor_name;
  }

  // Services grid
  const serviceItems = services?.items || services || [];
  if (serviceItems.length) {
    const grid = document.getElementById('services-grid');
    if (grid) {
      let shownServices = 6;
      window.openDrawer = function(s) {
        // defined inside list logic drawer setup trigger
        // fallback to main services page if needed loads anchors borders
      };
      
      function renderServices() {
        grid.innerHTML = serviceItems.slice(0, shownServices).map((s, i) => `
          <div class="service-card anim-fade-up anim-delay-${(i % 3) + 1}" style="cursor:pointer;"
               data-category="${s.category}"
               onclick="window.location.href='services.html'">
            <div class="svc-icon">${s.icon}</div>
            <p class="svc-name">${s.title || s.name}</p>
            <p class="svc-desc">${s.short_desc}</p>
          </div>
        `).join('');

        const viewMoreBtn = document.getElementById('all-services-btn');
        if (viewMoreBtn) {
          viewMoreBtn.textContent = shownServices >= serviceItems.length ? 'View Less' : 'View More Services';
          viewMoreBtn.onclick = (e) => {
            e.preventDefault();
            shownServices = shownServices >= serviceItems.length ? 6 : shownServices + 6;
            renderServices();
          };
        }
      }
      renderServices();
    }
  }

  // Before & After Gallery (Homepage)
  const galleryItems = gallery?.items || gallery || [];
  if (galleryItems.length) {
    const baGrid = document.getElementById('home-ba-grid');
    if (baGrid) {
      baGrid.innerHTML = galleryItems.slice(0, 2).map((item, i) => `
        <div class="ba-card anim-fade-up anim-delay-${i + 1}">
          <div class="ba-images">
            <div style="position:relative;width:50%;">
              <span class="ba-label before">BEFORE</span>
              <img src="${optimizeImage(item.before, 600, 400)}" alt="Before ${item.title || item.label || 'Case'}" loading="lazy">
            </div>
            <div style="position:relative;width:50%;">
              <span class="ba-label after">AFTER</span>
              <img src="${optimizeImage(item.after, 600, 400)}" alt="After ${item.title || item.label || 'Case'}" loading="lazy">
            </div>
          </div>
          <div class="ba-info">
            <h4>${item.title || item.label}</h4>
            <p>${item.category}</p>
          </div>
        </div>
      `).join('');
    }
  }

  // Testimonials (Homepage)
  const reviewItems = reviews?.items || reviews || [];
  if (reviewItems.length) {
    const testiGrid = document.getElementById('home-testi-grid');
    if (testiGrid) {
      testiGrid.innerHTML = reviewItems.slice(0, 8).map((r, i) => `
        <div class="testi-card anim-fade-up anim-delay-${(i % 3) + 1}">
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

  // Load Blogs for Home Page
  try {
    const posts = await fetchAllBlogPosts();
    const blogGrid = document.getElementById('home-blog-grid');
    if (blogGrid && posts.length) {
      blogGrid.innerHTML = posts.slice(0, 2).map((p) => `
        <div class="blog-card" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
          <div style="aspect-ratio:16/9;overflow:hidden;background:var(--ice);">
            <img src="${p.thumbnail}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;"
                 onerror="this.style.background='var(--gradient)';this.src='';">
          </div>
          <div style="padding:20px;">
            <span style="font-size:0.75rem;color:var(--sky);background:rgba(0,191,154,0.1);padding:4px 8px;border-radius:4px;">${p.tag}</span>
            <p style="font-weight:500;margin:12px 0 8px;font-size:1.1rem;line-height:1.4;">${p.title}</p>
            <p style="font-size:0.88rem;color:var(--gray);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;margin-bottom:16px;">${p.excerpt}</p>
            <a href="blog-post.html?slug=${p.slug}" style="font-weight:500;font-size:0.88rem;color:var(--deep);text-decoration:none;display:inline-flex;align-items:center;gap:4px;">Read More →</a>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error("Home blog load failed:", err);
  }
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
  const grid = document.getElementById('services-full-grid');
  if (!grid) return;

  function renderList(items) {
    grid.innerHTML = items.map(s => `
      <div class="service-full-card" data-category="${s.category}" data-id="${s.id}"
           onclick="openDrawer(${JSON.stringify(s).replace(/"/g, '&quot;')})">
        <div class="svc-full-icon">${s.icon}</div>
        <h3 class="svc-full-name">${s.title}</h3>
        <p class="svc-full-desc">${s.short_desc}</p>
        <span class="svc-view-btn">View Details &rarr;</span>
      </div>
    `).join('');
  }

  renderList(STATIC_SERVICES);

  // Filter Tabs
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const f = tab.dataset.filter;
      const filtered = f === 'all' ? STATIC_SERVICES : STATIC_SERVICES.filter(s => s.category === f);
      renderList(filtered);
    });
  });
}

/* ============================================================
   PAGE: ABOUT (about.html)
   ============================================================ */
async function loadAboutPage() {
  const about = {
    doctor_name: "Dr. Anmol Billore",
    degree: "BDS",
    specialization: "Implantologist",
    bio_full: "Dr. Anmol Billore is a highly experienced dental surgeon based in Indore with over 16 years of expertise in advanced implantology and aesthetic smile makeovers with painless treatment protocols framing flawlessly.",
    quote: "Every smile has a story. Our mission is to make yours healthy, bright and beautiful.",
    photo: "/images/dr-billore.jpg",
    specializations: [
      { name: "Implantology", icon: "🔬" },
      { name: "Smile Design", icon: "✨" },
      { name: "Cosmetic Dentistry", icon: "💎" },
      { name: "Restorative", icon: "⚡" },
      { name: "Laser Dentistry", icon: "🏥" },
      { name: "Painless Extractions", icon: "🦷" }
    ],
    timeline: [
      { year: "2010", label: "Graduated BDS", text: "Premier Dental Institution with core clinical excellence." },
      { year: "2015", label: "Implantology Training", text: "Advanced Surgical Implantology, Germany setup bounds." },
      { year: "2018", label: "IDA Membership", text: "Official member of Indian Dental Association framing." },
      { year: "2020", label: "MCI Verification", text: "MCI Verified practitioner fully compliant procedures." }
    ]
  };
  // disabled return

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
  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  function renderGallery(items) {
    grid.innerHTML = items.map(item => `
      <div class="gallery-card" data-category="${item.category}">
        <img-comparison-slider hover="hover">
          <figure slot="first">
            <img src="${item.before}" alt="Before ${item.title}" loading="lazy">
          </figure>
          <figure slot="second">
            <img src="${item.after}" alt="After ${item.title}" loading="lazy">
          </figure>
        </img-comparison-slider>
        <div class="ba-info">
          <h4>${item.title}</h4>
          <p>${item.category}</p>
        </div>
      </div>
    `).join('');
  }

  renderGallery(STATIC_GALLERY);

  // Filter Tabs
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const f = tab.dataset.filter;
      const filtered = f === 'all' ? STATIC_GALLERY : STATIC_GALLERY.filter(s => s.category === f);
      renderGallery(filtered);
    });
  });
}

/* ============================================================
   PAGE: REVIEWS (reviews.html)
   ============================================================ */
async function loadReviewsPage() {
  const data = await fetchJSON('_data/reviews.json');
  if (!data) return;

  const reviews = data.items || data;

  // Fix 9 — Star distribution chart insert
  const barChart = `
    <div class="reviews-summary" style="background:#fff;padding:24px;border-radius:16px;box-shadow:var(--shadow-md);max-width:480px;margin: 0 auto 40px;">
      <h3 style="margin-bottom:16px;text-align:center;">Patient Satisfaction</h3>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${[5,4,3,2,1].map(star => {
          const percents = { 5: 78, 4: 15, 3: 4, 2: 2, 1: 1 };
          const p = percents[star];
          return `
            <div style="display:flex;align-items:center;gap:12px;font-size:0.9rem;">
              <span style="min-width:24px;">${star}★</span>
              <div style="flex:1;background:#E1F5EE;height:12px;border-radius:6px;overflow:hidden;">
                <div style="background:var(--clr-primary);width:${p}%;height:100%;"></div>
              </div>
              <span style="min-width:32px;text-align:right;">${p}%</span>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  const reviewsSection = document.querySelector('.reviews-grid')?.parentElement;
  if (reviewsSection && !document.querySelector('.reviews-summary')) {
      reviewsSection.insertAdjacentHTML('afterbegin', barChart);
  }


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
   ============================================================ */

// Fetch all blog posts from the auto-generated Netlify index
async function fetchAllBlogPosts() {
  try {
    // This JSON file is created by build-blog.js when the site deploys
    const response = await fetch('_data/blog_index.json');
    if (!response.ok) return [];
    
    let posts = await response.json();
    
    // Sort by date descending just to be safe
    return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  } catch (err) {
    console.error("Failed to fetch blog index:", err);
    return [];
  }
}

// Global cached posts
let BLOG_POSTS = [];

async function loadBlogPage() {
  const posts = await fetchAllBlogPosts();
  BLOG_POSTS = posts; // Cache for other uses


  // Featured
  const featured = document.getElementById('featured-post');
  if (featured && posts.length > 0) {
    const p = posts[0];
    featured.innerHTML = `
      <div class="featured-post-img">
        <img src="${optimizeImage(p.thumbnail, 800, 450)}" alt="${p.title}" style="width:100%;height:100%;min-height:320px;"
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
          <img src="${optimizeImage(p.thumbnail, 600, 338)}" alt="${p.title}"
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
  // Try to load index first to get related posts
  if (BLOG_POSTS.length === 0) {
    BLOG_POSTS = await fetchAllBlogPosts();
  }

  const params = new URLSearchParams(window.location.search);
  const fallbackSlug = BLOG_POSTS.length > 0 ? BLOG_POSTS[0].slug : '2025-03-10-dental-implant-signs';
  const slug = params.get('slug') || fallbackSlug;

  const raw = await fetchText(`_data/blog/${slug}.md`);
  if (!raw) {
    const postBody = document.getElementById('post-body');
    if (postBody) postBody.innerHTML = '<p>Post not found. It may have been removed or renamed.</p>';
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
