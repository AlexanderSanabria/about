const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const dataEnd = source.indexOf('const dialog =');
if (dataEnd < 0) throw new Error('Project data block not found in script.js');
const projects = vm.runInNewContext(`${source.slice(0, dataEnd)}\nprojects;`, {}, { timeout: 1000 });

const slugs = {
  squad: 'squad-arcade',
  fsx: 'fsx-play-golf-simulator',
  manikins: 'manikins-relics-and-tactics',
  incantum: 'incantum',
  go: 'go-simulator',
  ibahell: 'welcome-to-ibahell'
};
const baseUrl = 'https://alexandersanabria.github.io/about/';
const outputDir = path.join(root, 'projects');
fs.mkdirSync(outputDir, { recursive: true });

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

const entries = Object.entries(projects);
for (const [index, [key, project]] of entries.entries()) {
  const slug = slugs[key];
  if (!slug) throw new Error(`Missing slug for ${key}`);
  const canonical = `${baseUrl}projects/${slug}.html`;
  const next = entries[(index + 1) % entries.length];
  const imageMeta = project.images.length
    ? `<meta property="og:image" content="${baseUrl}${escapeHtml(project.images[0][0])}" />`
    : '';
  const role = project.role
    ? `<p class="case-role">${escapeHtml(project.role)}</p>`
    : '';
  const contribution = project.contribution
    ? `<section class="case-copy" aria-labelledby="contribution-title"><p class="eyebrow">My contribution</p><h2 id="contribution-title">The work behind it</h2><p>${escapeHtml(project.contribution)}</p></section>`
    : '';
  const gallery = project.images.length
    ? `<div class="case-gallery" role="group" aria-label="Project images">${project.images.map(([url, alt], imageIndex) => `<figure><img src="../${escapeHtml(url)}" alt="${escapeHtml(alt)}" loading="${imageIndex === 0 ? 'eager' : 'lazy'}" /><figcaption>${escapeHtml(alt)}</figcaption></figure>`).join('')}</div>`
    : `<div class="case-no-image"><span>GO<span class="case-plus">+</span></span><small>SIMULATOR</small></div>`;
  const links = project.links.length
    ? `<div class="case-links">${project.links.map(([label, url]) => `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)} <span aria-hidden="true">↗</span></a>`).join('')}</div>`
    : '';
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#0b1018" />
    <meta name="description" content="${escapeHtml(project.description)}" />
    <meta property="og:title" content="${escapeHtml(project.title)} — Alexander Sanabria" />
    <meta property="og:description" content="${escapeHtml(project.description)}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${canonical}" />
    ${imageMeta}
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" href="../favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="../styles.css" />
    <link rel="stylesheet" href="../project-page.css" />
    <title>${escapeHtml(project.title)} — Alexander Sanabria</title>
  </head>
  <body>
    <a class="skip-link" href="#main">Skip to content</a>
    <div class="site-shell">
      <header class="site-header">
        <a class="brand" href="../index.html" aria-label="Alexander Sanabria, portfolio home"><span class="brand-mark" aria-hidden="true">AS<span class="brand-dot">.</span></span><span class="brand-name">Alexander<br />Sanabria</span></a>
        <nav class="case-nav" aria-label="Project navigation"><a href="../index.html#work">All work <span aria-hidden="true">↗</span></a><a href="../index.html#contact">Let's talk <span aria-hidden="true">↗</span></a></nav>
      </header>
      <main id="main" class="case-main">
        <div class="case-heading"><a class="case-back" href="../index.html#work">← Back to selected work</a><p class="eyebrow">${String(index + 1).padStart(2, '0')} / ${escapeHtml(project.category)}</p><h1>${escapeHtml(project.title)}</h1>${role}<p class="case-summary">${escapeHtml(project.description)}</p></div>
        ${gallery}
        ${contribution}
        <div class="case-bottom"><div><p class="eyebrow">Tools & focus</p><div class="tags">${project.tags.map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div></div>${links}</div>
        <a class="case-next" href="${escapeHtml(slugs[next[0]])}.html"><span>Next project</span><strong>${escapeHtml(next[1].title)}</strong><span aria-hidden="true">↗</span></a>
      </main>
      <footer class="site-footer"><a class="brand footer-brand" href="../index.html"><span class="brand-mark">AS<span class="brand-dot">.</span></span><span class="brand-name">Alexander<br />Sanabria</span></a><p>Software engineering & game development<br />based in Colombia.</p><a href="../index.html#work">All work ↑</a></footer>
    </div>
  </body>
</html>
`;
  fs.writeFileSync(path.join(outputDir, `${slug}.html`), html);
}

const urls = [baseUrl, ...entries.map(([key]) => `${baseUrl}projects/${slugs[key]}.html`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(url => `  <url><loc>${escapeHtml(url)}</loc></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap);
console.log(`Generated ${entries.length} project pages and sitemap.xml`);
