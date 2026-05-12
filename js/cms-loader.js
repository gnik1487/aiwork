async function fetchArticleFiles() {
  // CHANGE these:
  const owner = "gnik1487";
  const repo = "aiwork";
  const branch = "main";

  const api = `https://api.github.com/repos/${owner}/${repo}/contents/content/articles?ref=${branch}`;
  const res = await fetch(api);
  if (!res.ok) throw new Error("Failed to load article list");
  const files = await res.json();
  return files.filter(f => f.name.endsWith(".md"));
}

function parseFrontmatter(md) {
  const match = md.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { data: {}, content: md };
  const yaml = match[1];
  const content = md.slice(match[0].length);
  const data = {};
  yaml.split("\n").forEach(line => {
    const i = line.indexOf(":");
    if (i > -1) {
      const key = line.slice(0, i).trim();
      let val = line.slice(i + 1).trim();
      val = val.replace(/^"|"$/g, "");
      data[key] = val;
    }
  });
  return { data, content };
}

function mdToHtml(md) {
  // lightweight markdown converter (basic)
  return md
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^/, "<p>")
    .concat("</p>");
}

async function fetchArticleMarkdown(downloadUrl) {
  const res = await fetch(downloadUrl);
  return res.text();
}

async function loadArticles() {
  const files = await fetchArticleFiles();
  const items = [];

  for (const file of files) {
    const md = await fetchArticleMarkdown(file.download_url);
    const { data } = parseFrontmatter(md);
    items.push({
      title: data.title || "Untitled",
      slug: data.slug || file.name.replace(".md", ""),
      category: data.category || "research",
      description: data.description || "",
      date: data.date || "",
      reading_time: Number(data.reading_time || 6),
      image: data.image || "/images/featured-1.png",
      featured: data.featured === "true"
    });
  }

  items.sort((a,b) => new Date(b.date) - new Date(a.date));
  return items;
}

async function loadSingleArticle(slug) {
  const files = await fetchArticleFiles();
  const target = files.find(f => f.name === `${slug}.md`);
  if (!target) return null;
  const md = await fetchArticleMarkdown(target.download_url);
  const { data, content } = parseFrontmatter(md);

  return {
    ...data,
    shortHtml: mdToHtml(data.short || ""),
    longHtml: mdToHtml(data.long || content || "")
  };
}