// Otium — motion + interaction (vanilla, no deps)
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scroll reveal — differentiated by role via .reveal / [data-reveal]
const io = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    }
  },
  { threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
);
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Sticky header state on scroll
const header = document.querySelector('[data-header]');
if (header) {
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// Mobile nav toggle
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

// Hero parallax (subtle)
if (!prefersReduced) {
  const parallax = [...document.querySelectorAll('[data-parallax]')];
  if (parallax.length) {
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      for (const el of parallax) {
        const speed = parseFloat(el.dataset.parallax) || 0.15;
        el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      }
      ticking = false;
    };
    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
  }
}

// Footer year
const yearEl = document.querySelector('[data-year]');
if (yearEl) yearEl.textContent = new Date().getFullYear();
