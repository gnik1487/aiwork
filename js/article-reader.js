/* ============================================
   ZULOMA — Article Reader JavaScript
   ============================================ */

const READING_MODE_KEY = 'zuloma-reading-mode';
const SCROLL_THRESHOLD = 0.65;

document.addEventListener('DOMContentLoaded', () => {
  initReadingModeToggle();
  initProgressBar();
  initTOC();
  initShareButtons();
  initPatreonBanner();
  calculateReadingTime();
});

function getCurrentMode() {
  const saved = sessionStorage.getItem(READING_MODE_KEY);
  return saved === 'long' ? 'long' : 'short';
}

function applyReadingMode(mode) {
  const shortBtn = document.getElementById('mode-short');
  const longBtn = document.getElementById('mode-long');
  const articleWrap = document.querySelector('.article-wrapper');
  if (!articleWrap) return;

  const isLong = mode === 'long';
  articleWrap.classList.toggle('reading-long', isLong);
  articleWrap.dataset.mode = mode;

  if (shortBtn) shortBtn.classList.toggle('active', !isLong);
  if (longBtn) longBtn.classList.toggle('active', isLong);

  sessionStorage.setItem(READING_MODE_KEY, mode);
  calculateReadingTime();
}

/* ── Reading Progress Bar ── */
function initProgressBar() {
  const bar = document.getElementById('reading-progress');
  const article = document.querySelector('.article-content');
  if (!bar || !article) return;

  const updateProgress = () => {
    const rect = article.getBoundingClientRect();
    const articleTop = rect.top + window.scrollY;
    const articleHeight = Math.max(article.scrollHeight, article.offsetHeight, 1);
    const scrolled = window.scrollY - articleTop + window.innerHeight * 0.3;
    const progress = Math.min(Math.max(scrolled / articleHeight * 100, 0), 100);
    bar.style.width = `${progress}%`;
    bar.setAttribute('aria-valuenow', progress.toFixed(0));
  };

  window.addEventListener('scroll', () => requestAnimationFrame(updateProgress), { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();
}

/* ── Table of Contents + Active Highlight ── */
function initTOC() {
  const tocList = document.querySelector('.toc-list');
  const articleWrap = document.querySelector('.article-wrapper');
  const content = articleWrap?.classList.contains('reading-long')
    ? document.querySelector('.content-long')
    : document.querySelector('.content-short');
  if (!tocList || !content) return;

  const headings = content.querySelectorAll('h2, h3');
  if (!headings.length) return;

  tocList.innerHTML = '';
  headings.forEach((heading, idx) => {
    if (!heading.id) heading.id = `section-${idx + 1}`;
    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent?.trim() || `Section ${idx + 1}`;
    link.className = heading.tagName.toLowerCase() === 'h3' ? 'toc-subitem' : 'toc-item';
    tocList.appendChild(link);
  });

  const tocLinks = tocList.querySelectorAll('a');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      tocLinks.forEach(link => link.classList.remove('active'));
      const activeLink = tocList.querySelector(`a[href="#${entry.target.id}"]`);
      if (activeLink) activeLink.classList.add('active');
    });
  }, { rootMargin: '-80px 0px -70% 0px', threshold: 0 });

  headings.forEach(h => observer.observe(h));
}

/* ── Short/Long Form Toggle ── */
function initReadingModeToggle() {
  const shortBtn = document.getElementById('mode-short');
  const longBtn = document.getElementById('mode-long');
  if (!shortBtn || !longBtn) return;

  applyReadingMode(getCurrentMode());
  initTOC();

  shortBtn.addEventListener('click', () => {
    applyReadingMode('short');
    initTOC();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  longBtn.addEventListener('click', () => {
    applyReadingMode('long');
    initTOC();
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

  const words = (content.textContent || '').trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 220));
  timeEl.textContent = `${minutes} min read`;
}

/* ── Share Buttons + Native/Fallback Copy ── */
function initShareButtons() {
  document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const platform = btn.dataset.platform;
      const rawUrl = btn.dataset.url || window.location.href;
      const rawTitle = btn.dataset.title || document.title;
      const url = encodeURIComponent(rawUrl);
      const title = encodeURIComponent(rawTitle);

      if (platform === 'native' && navigator.share) {
        await navigator.share({ title: rawTitle, url: rawUrl });
        return;
      }

      if (platform === 'copy') {
        await copyToClipboard(rawUrl, btn);
        return;
      }

      const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
        pinterest: `https://pinterest.com/pin/create/button/?url=${url}&description=${title}`
      };

      const shareUrl = shareUrls[platform];
      if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400');
    });
  });
}

async function copyToClipboard(text, button) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const input = document.createElement('textarea');
      input.value = text;
      input.setAttribute('readonly', '');
      input.style.position = 'fixed';
      input.style.opacity = '0';
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    }
    button.classList.add('copied');
    setTimeout(() => button.classList.remove('copied'), 2000);
  } catch (error) {
    console.warn('Copy failed', error);
  }
}

/* ── Patreon Banner Scroll Threshold ── */
function initPatreonBanner() {
  const banner = document.querySelector('.patreon-banner');
  const article = document.querySelector('.article-content');
  if (!banner || !article) return;

  const onScroll = () => {
    const maxScroll = article.scrollHeight - window.innerHeight;
    if (maxScroll <= 0) return;
    const relative = (window.scrollY - article.offsetTop) / maxScroll;
    banner.classList.toggle('is-visible', relative >= SCROLL_THRESHOLD);
  };

  window.addEventListener('scroll', () => requestAnimationFrame(onScroll), { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();
}
