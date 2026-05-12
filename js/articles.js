/* ============================================
   ZULOMA — Articles Page JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  initSearch();
  initViewToggle();
});

/* ── Category Filter ── */
function initFilters() {
  const pills = document.querySelectorAll('.filter-pill');
  const cards = document.querySelectorAll('.article-card');
  if (!pills.length || !cards.length) return;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cat = pill.dataset.category;

      cards.forEach(card => {
        if (cat === 'all' || card.dataset.category === cat) {
          card.style.display = '';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });
}

/* ── Search ── */
function initSearch() {
  const input = document.getElementById('article-search');
  const cards = document.querySelectorAll('.article-card');
  if (!input || !cards.length) return;

  input.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    cards.forEach(card => {
      const title = (card.querySelector('.card-title')?.textContent || '').toLowerCase();
      const excerpt = (card.querySelector('.card-excerpt')?.textContent || '').toLowerCase();
      const match = !q || title.includes(q) || excerpt.includes(q);
      card.style.display = match ? '' : 'none';
    });
  });
}

/* ── Grid/List View Toggle ── */
function initViewToggle() {
  const gridBtn = document.getElementById('view-grid');
  const listBtn = document.getElementById('view-list');
  const grid = document.querySelector('.articles-grid');
  if (!gridBtn || !listBtn || !grid) return;

  gridBtn.addEventListener('click', () => {
    gridBtn.classList.add('active');
    listBtn.classList.remove('active');
    grid.classList.remove('list-view');
  });

  listBtn.addEventListener('click', () => {
    listBtn.classList.add('active');
    gridBtn.classList.remove('active');
    grid.classList.add('list-view');
  });
}
