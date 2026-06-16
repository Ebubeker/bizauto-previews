// Golden Rooster — motion system (vanilla, no deps)
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Stagger groups: give children an index for staggered transition-delay
document.querySelectorAll('[data-stagger]').forEach((group) => {
  [...group.children].forEach((c, i) => c.style.setProperty('--i', i));
});

// Reveal on scroll (variants handled in CSS via [data-anim])
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    }
  },
  { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
);
document.querySelectorAll('[data-anim]').forEach((el) => io.observe(el));

// Count-up numbers
const countIO = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        animateCount(e.target);
        countIO.unobserve(e.target);
      }
    }
  },
  { threshold: 0.6 }
);
document.querySelectorAll('[data-count]').forEach((el) => countIO.observe(el));
function animateCount(el) {
  const raw = el.dataset.count;
  const target = parseFloat(raw);
  const dec = (raw.split('.')[1] || '').length;
  if (reduce) {
    el.textContent = target.toFixed(dec);
    return;
  }
  const dur = 1500;
  const t0 = performance.now();
  function tick(t) {
    const p = Math.min(1, (t - t0) / dur);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = (target * eased).toFixed(dec);
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target.toFixed(dec);
  }
  requestAnimationFrame(tick);
}

// Parallax (subtle)
if (!reduce) {
  const px = [...document.querySelectorAll('[data-parallax]')];
  if (px.length) {
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      for (const el of px) {
        const s = parseFloat(el.dataset.parallax) || 0.12;
        el.style.transform = `translate3d(0, ${y * s}px, 0)`;
      }
      ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(update); ticking = true; } }, { passive: true });
  }
}

// Header scroll state
const header = document.querySelector('[data-header]');
if (header) {
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// Mobile nav
const navToggle = document.querySelector('[data-nav-toggle]');
const nav = document.querySelector('[data-nav]');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) document.body.classList.remove('nav-open');
  });
}

// Footer year
const yearEl = document.querySelector('[data-year]');
if (yearEl) yearEl.textContent = new Date().getFullYear();
