/* ============================================
   ZULOMA — Chart Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initBarCharts();
  initCounters();
});

/* ── Animate Bar Charts on Scroll ── */
function initBarCharts() {
  const charts = document.querySelectorAll('.bar-chart');
  if (!charts.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bars = entry.target.querySelectorAll('.bar-fill');
        bars.forEach((bar, i) => {
          const width = bar.dataset.width || bar.style.width;
          bar.style.width = '0';
          setTimeout(() => { bar.style.width = width; }, 100 + i * 80);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  charts.forEach(c => observer.observe(c));
}

/* ── Counter Animation ── */
function initCounters() {
  const counters = document.querySelectorAll('.counter[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const duration = 1500;
        const start = performance.now();

        function update(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * target);
          el.textContent = prefix + current.toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}
