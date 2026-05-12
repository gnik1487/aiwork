
const CMS_CONFIG = {
  owner: "gnik1487",
  repo: "aiwork",
  branch: "main",
  folder: "content/articles"
};

async function githubListFiles() {
  const url = `https://api.github.com/repos/${CMS_CONFIG.owner}/${CMS_CONFIG.repo}/contents/${CMS_CONFIG.folder}?ref=${CMS_CONFIG.branch}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Could not fetch article list from GitHub");
  const data = await res.json();
  return data.filter(f => f.name.endsWith(".md"));
}

function parseYAMLValue(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  if (/^\d+$/.test(value)) return Number(value);
  return value.replace(/^"|"$/g, "").trim();
}

function parseFrontmatter(md) {
  const match = md.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: md };
  const [, raw, body] = match;
  const meta = {};
  raw.split("\n").forEach(line => {
    const idx = line.indexOf(":");
    if (idx > -1) {
      const key = line.slice(0, idx).trim();
      const val = line.slice(idx + 1).trim();
      meta[key] = parseYAMLValue(val);
    }
  });
  return { meta, body };
}

function basicMarkdownToHtml(md) {
  return md
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/^\- (.*)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]*?<\/li>)/g, "<ul>$1</ul>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^/, "<p>")
    .concat("</p>");
}

async function loadArticles() {
  const files = await githubListFiles();
  const out = [];
  for (const f of files) {
    const md = await fetch(f.download_url).then(r => r.text());
    const { meta, body } = parseFrontmatter(md);

    // split short/long by markers
    const shortMatch = body.match(/## shortContent([\s\S]*?)## longContent/i);
    const longMatch = body.match(/## longContent([\s\S]*)$/i);

    out.push({
      ...meta,
      slug: meta.slug || f.name.replace(".md", ""),
      shortContent: shortMatch ? shortMatch[1].trim() : "",
      longContent: longMatch ? longMatch[1].trim() : ""
    });
  }

  out.sort((a, b) => new Date(b.publishDate || 0) - new Date(a.publishDate || 0));
  return out;
}

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}