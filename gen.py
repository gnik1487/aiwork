#!/usr/bin/env python3
"""Generate all 20 Zuloma article pages."""
import os, json

OUT = os.path.dirname(os.path.abspath(__file__))

NAV = '''<nav class="navbar"><div class="navbar-inner"><a href="/" class="navbar-logo">Zulo<span>ma</span></a><ul class="nav-links"><li><a href="/">Home</a></li><li><a href="/articles.html">Articles</a></li><li><a href="/about.html">About</a></li><li><a href="/contact.html">Contact</a></li></ul><div class="nav-actions"><button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme"><svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg><svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg></button><button class="menu-toggle" aria-label="Menu"><span></span><span></span><span></span></button></div></div></nav><div class="mobile-nav"><a href="/">Home</a><a href="/articles.html">Articles</a><a href="/about.html">About</a><a href="/contact.html">Contact</a></div>'''

SHARE = '''<div class="share-bar"><span>Share</span><button class="share-btn" data-platform="twitter"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></button><button class="share-btn" data-platform="facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></button><button class="share-btn" data-platform="copy"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg></button></div>'''

FOOT = '''<footer class="footer"><div class="container"><div class="footer-bottom"><p>&copy; 2025 Zuloma. All rights reserved.</p></div></div></footer>'''

def make_article(a):
    toc_html = ''.join(f'<a href="#{t["id"]}">{t["text"]}</a>' for t in a.get('toc',[]))
    return f'''<!DOCTYPE html>
<html lang="en" data-theme="light">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>{a["title"]} — Zuloma</title>
<meta name="description" content="{a["excerpt"]}">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="stylesheet" href="/css/variables.css"><link rel="stylesheet" href="/css/base.css">
<link rel="stylesheet" href="/css/components.css"><link rel="stylesheet" href="/css/layouts.css">
<link rel="stylesheet" href="/css/articles.css"><link rel="stylesheet" href="/css/animations.css">
<link rel="stylesheet" href="/css/charts.css">
<script defer src="/js/main.js"></script><script defer src="/js/article-reader.js"></script>
<script defer src="/js/charts.js"></script>
</head><body>
<div class="progress-bar"></div>
{NAV}
<article>
<header class="article-header">
<span class="badge badge-{a["cat"]}">{a["catName"]}</span>
<h1>{a["title"]}</h1>
<p class="article-subtitle">{a["subtitle"]}</p>
<div class="article-meta"><span>By Zuloma</span><span class="dot"></span><span id="reading-time">3 min read</span><span class="dot"></span><span>{a["date"]}</span></div>
<div style="margin-top:var(--space-6);display:flex;justify-content:center;">
<div class="reading-mode-toggle"><button class="reading-mode-btn active" id="mode-short">Short</button><button class="reading-mode-btn" id="mode-long">Long Form</button></div>
</div>
</header>
<div class="article-hero-image"><img src="/images/{a["img"]}" alt="{a["title"]}"></div>
<div class="article-wrapper">
<div class="article-layout">
<aside class="toc" style="display:none;">
<div class="toc-title">Contents</div>
<nav class="toc-list">{toc_html}</nav>
</aside>
<div class="article-content">
<div class="content-short"><div class="prose">{a["short"]}</div></div>
<div class="content-long"><div class="prose">{a["long"]}</div></div>
{SHARE}
</div>
</div>
</div>
</article>
{FOOT}
</body></html>'''

# Load articles from parts
import glob
parts = sorted(glob.glob(os.path.join(OUT, 'articles-part*.json')))
articles = []
for p in parts:
    with open(p) as f:
        articles.extend(json.load(f))

for a in articles:
    path = os.path.join(OUT, f'article-{a["slug"]}.html')
    with open(path, 'w') as f:
        f.write(make_article(a))
    print(f'Created: article-{a["slug"]}.html')

print(f'Done! {len(articles)} articles generated.')
