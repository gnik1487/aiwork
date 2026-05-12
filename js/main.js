/* ============================================
   ZULOMA — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavbar();
  initScrollReveal();
  initMobileMenu();
  initHeroAnimation();
  initHeroParallax();
  initCursor();
});

/* ── Theme Toggle ── */
function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  const stored = localStorage.getItem('zuloma-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);

  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('zuloma-theme', next);
    });
  }
}

/* ── Smart Navbar (hide on scroll down, show on scroll up) ── */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  let lastScroll = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScroll = window.scrollY;
        if (currentScroll <= 80) {
          navbar.classList.remove('hidden');
        } else if (currentScroll > lastScroll && currentScroll > 200) {
          navbar.classList.add('hidden');
        } else if (currentScroll < lastScroll) {
          navbar.classList.remove('hidden');
        }
        lastScroll = currentScroll;
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* ── Scroll Reveal (IntersectionObserver) ── */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .slide-up, .fade-in, .stagger-children');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => observer.observe(el));
}

/* ── Mobile Menu ── */
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ── Hero Title Word Animation ── */
function initHeroAnimation() {
  const heroTitle = document.querySelector('.hero-title');
  if (!heroTitle) return;

  const text = heroTitle.textContent.trim();
  const words = text.split(' ');
  heroTitle.innerHTML = words.map(w => `<span class="word">${w}</span>`).join(' ');

  setTimeout(() => heroTitle.classList.add('animated'), 200);
}

/* ── Hero Parallax Effect ── */
function initHeroParallax() {
  const heroBgImg = document.querySelector('.hero-bg img');
  const hero = document.querySelector('.hero');
  if (!heroBgImg || !hero) return;

  let ticking = false;

  function updateParallax() {
    const rect = hero.getBoundingClientRect();
    const scrollTop = window.scrollY;
    const heroHeight = rect.height;
    const heroTop = rect.top + scrollTop;

    // Only apply parallax when hero is in viewport
    if (scrollTop + window.innerHeight > heroTop && scrollTop < heroTop + heroHeight) {
      const parallaxOffset = (scrollTop - heroTop) * 0.5; // Adjust 0.5 for parallax speed
      heroBgImg.style.transform = `translateY(${parallaxOffset}px)`;
    }

    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestTick);
  updateParallax(); // Initial call
}

/* ── Smooth Scroll for Anchor Links ── */
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const target = document.querySelector(link.getAttribute('href'));
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});
/* ── Luxury Custom Cursor ── */
function initCursor() {
  // Create the elements
  const cursorDot = document.createElement('div');
  const cursorRing = document.createElement('div');
  
  // Style them directly for precision
  Object.assign(cursorDot.style, {
    position: 'fixed', width: '8px', height: '8px', backgroundColor: 'hsl(var(--accent))',
    borderRadius: '50%', pointerEvents: 'none', zIndex: '10000', transform: 'translate(-50%, -50%)'
  });
  
  Object.assign(cursorRing.style, {
    position: 'fixed', width: '40px', height: '40px', border: '1px solid hsl(var(--accent))',
    borderRadius: '50%', pointerEvents: 'none', zIndex: '9999', transform: 'translate(-50%, -50%)',
    transition: 'transform 0.15s ease-out'
  });

  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorRing);

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });

  function animate() {
    // Lerp (Linear Interpolation) for a smooth "trailing" effect
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';
    requestAnimationFrame(animate);
  }
  animate();

  // Interaction: Expand ring on hover
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorRing.style.transform = 'translate(-50%, -50%) scale(1.5)';
      cursorRing.style.backgroundColor = 'hsla(var(--accent), 0.1)';
    });
    el.addEventListener('mouseleave', () => {
      cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
      cursorRing.style.backgroundColor = 'transparent';
    });
  });
}
