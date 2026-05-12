/* ============================================
   ZULOMA — Article Reader JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initProgressBar();
  initTOC();
  initReadingModeToggle();
  initShareButtons();
  calculateReadingTime();
});

/* ── Reading Progress Bar ── */
function initProgressBar() {
  const bar = document.querySelector('.progress-bar');
  const article = document.querySelector('.article-content');
  if (!bar || !article) return;

  window.addEventListener('scroll', () => {
    requestAnimationFrame(() => {
      const rect = article.getBoundingClientRect();
      const articleTop = rect.top + window.scrollY;
      const articleHeight = article.offsetHeight;
      const scrolled = window.scrollY - articleTop + window.innerHeight * 0.3;
      const progress = Math.min(Math.max(scrolled / articleHeight * 100, 0), 100);
      bar.style.width = progress + '%';
    });
  });
}

/* ── Sticky Table of Contents ── */
function initTOC() {
  const tocLinks = document.querySelectorAll('.toc-list a');
  const headings = document.querySelectorAll('.article-content h2[id], .article-content h3[id]');
  if (!tocLinks.length || !headings.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tocLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.toc-list a[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { rootMargin: '-80px 0px -70% 0px', threshold: 0 });

  headings.forEach(h => observer.observe(h));
}

/* ── Short/Long Form Toggle ── */
function initReadingModeToggle() {
  const shortBtn = document.getElementById('mode-short');
  const longBtn = document.getElementById('mode-long');
  const articleWrap = document.querySelector('.article-wrapper');
  const toc = document.querySelector('.toc');
  if (!shortBtn || !longBtn || !articleWrap) return;

  shortBtn.addEventListener('click', () => {
    shortBtn.classList.add('active');
    longBtn.classList.remove('active');
    articleWrap.classList.remove('reading-long');
    if (toc) toc.style.display = 'none';
    calculateReadingTime();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  longBtn.addEventListener('click', () => {
    longBtn.classList.add('active');
    shortBtn.classList.remove('active');
    articleWrap.classList.add('reading-long');
    if (toc) toc.style.display = '';
    calculateReadingTime();
  });
}

/* ── Calculate Reading Time ── */
function calculateReadingTime() {
  const articleWrap = document.querySelector('.article-wrapper');
  const timeEl = document.getElementById('reading-time');
  if (!articleWrap || !timeEl) return;

  const isLong = articleWrap.classList.contains('reading-long');
  const content = isLong
    ? document.querySelector('.content-long')
    : document.querySelector('.content-short');
  if (!content) return;

  const words = content.textContent.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 220);
  timeEl.textContent = `${minutes} min read`;
}

/* ── Share Buttons ── */
function initShareButtons() {
  document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const platform = btn.dataset.platform;
      const url = encodeURIComponent(window.location.href);
      const title = encodeURIComponent(document.title);
      let shareUrl = '';

      switch (platform) {
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
          break;
        case 'facebook':
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
          break;
        case 'linkedin':
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
          break;
        case 'pinterest':
          shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&description=${title}`;
          break;
        case 'copy':
          navigator.clipboard.writeText(window.location.href).then(() => {
            btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
            setTimeout(() => {
              btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>';
            }, 2000);
          });
          return;
      }
      if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400');
    });
  });
}
