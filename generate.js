const fs=require('fs');
const P='/Users/lavisahu/Documents/Aiwork/Blog Website/dist/public';
const articles=require('./article-data.json');
const nav=`<nav class="navbar"><div class="navbar-inner"><a href="/" class="navbar-logo">Zulo<span>ma</span></a><ul class="nav-links"><li><a href="/">Home</a></li><li><a href="/articles.html">Articles</a></li><li><a href="/about.html">About</a></li><li><a href="/contact.html">Contact</a></li></ul><div class="nav-actions"><button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme"><svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg><svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg></button><button class="menu-toggle" aria-label="Menu"><span></span><span></span><span></span></button></div></div></nav><div class="mobile-nav"><a href="/">Home</a><a href="/articles.html">Articles</a><a href="/about.html">About</a><a href="/contact.html">Contact</a></div>`;
const share=`<div class="share-bar"><span>Share</span><button class="share-btn" data-platform="native" data-title="${a.title}" data-url="https://zuloma.com/article-${a.slug}.html" aria-label="Share article"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/></svg></button><button class="share-btn" data-platform="twitter" data-title="${a.title}" data-url="https://zuloma.com/article-${a.slug}.html"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></button><button class="share-btn" data-platform="facebook" data-title="${a.title}" data-url="https://zuloma.com/article-${a.slug}.html"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></button><button class="share-btn" data-platform="copy" data-title="${a.title}" data-url="https://zuloma.com/article-${a.slug}.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></button></div>`;
const foot=`<footer class="footer"><div class="container"><div class="footer-bottom"><p>&copy; 2025 Zuloma. All rights reserved.</p></div></div></footer>`;

articles.forEach(a=>{
const tocHtml=a.toc?a.toc.map(t=>`<a href="#${t.id}">${t.text}</a>`).join(''):'';
const html=`<!DOCTYPE html>
<html lang="en" data-theme="light">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${a.title} — Zuloma</title>
<meta name="description" content="${a.excerpt}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="stylesheet" href="/css/variables.css"><link rel="stylesheet" href="/css/base.css">
<link rel="stylesheet" href="/css/components.css"><link rel="stylesheet" href="/css/layouts.css">
<link rel="stylesheet" href="/css/articles.css"><link rel="stylesheet" href="/css/animations.css">
<link rel="stylesheet" href="/css/charts.css">
<script defer src="/js/main.js"><\/script><script defer src="/js/article-reader.js"><\/script>
<script defer src="/js/charts.js"><\/script>
</head><body>
<div id="reading-progress" class="progress-bar" role="progressbar" aria-label="Reading progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"></div>
${nav}
<article>
<header class="article-header">
<span class="badge badge-${a.cat}">${a.catName}</span>
<h1>${a.title}</h1>
<p class="article-subtitle">${a.subtitle}</p>
<div class="article-meta"><span>By Zuloma</span><span class="dot"></span><span id="reading-time">3 min read</span><span class="dot"></span><span>${a.date}</span></div>
<div style="margin-top:var(--space-6);display:flex;justify-content:center;">
<div class="reading-mode-toggle"><button class="reading-mode-btn active" id="mode-short">Short</button><button class="reading-mode-btn" id="mode-long">Long Form</button></div>
</div>
</header>
<div class="article-hero-image"><img src="/images/${a.img}" alt="${a.title}"></div>
<div class="article-wrapper">
<div class="article-layout">
<aside class="toc">
<div class="toc-title">Contents</div>
<nav id="article-toc" class="toc-list" aria-label="Table of contents">${tocHtml}</nav>
</aside>
<div class="article-content">
<div class="content-short"><div class="prose">${a.shortContent}</div></div>
<div class="content-long"><div class="prose">${a.longContent}</div></div>
${share}
<div class="patreon-banner" role="complementary">Enjoying this article? <a href="https://patreon.com/Zuloma" target="_blank" rel="noopener">Support us on Patreon</a>.</div>
<noscript><style>.reading-mode-toggle{display:none}.content-long{display:block}.toc{display:block}.patreon-banner{display:block;position:static;opacity:1;transform:none}</style><p>JavaScript is disabled, so both short and long article versions are shown for easier reading.</p></noscript>
</div>
</div>
</div>
</article>
${foot}
</body></html>`;
fs.writeFileSync(`${P}/article-${a.slug}.html`,html);
console.log('Created: article-'+a.slug+'.html');
});
console.log('Done! '+articles.length+' articles created.');
