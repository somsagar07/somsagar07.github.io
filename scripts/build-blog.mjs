import { readdir, readFile, writeFile, mkdir, copyFile, cp } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { Marked } from 'marked';
import katex from 'katex';
import { parse } from 'yaml';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://somsagar07.github.io';
const CATEGORIES = [
  { id: 'research', name: 'Research' },
  { id: 'learning', name: 'Learning' },
  { id: 'conferences-travel', name: 'Conferences & Travel' },
];
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const json = value => JSON.stringify(value, null, 2).replace(/</g, '\\u003c');
const slugify = value => String(value).normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section';
const prettyDate = date => new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(date + 'T00:00:00Z'));

export function renderMarkdown(markdown) {
  const headings = [];
  const ids = new Map();
  const usedIds = new Set();
  const math = (source, displayMode) => katex.renderToString(source, { displayMode, throwOnError: true, strict: 'ignore', trust: false, output: 'htmlAndMathml' });
  const marked = new Marked({ gfm: true, breaks: false });
  marked.use({
    extensions: [
      {
        name: 'displayMath', level: 'block',
        start(source) { return source.indexOf('$$'); },
        tokenizer(source) {
          const match = /^\$\$[ \t]*\n([\s\S]*?)\n\$\$(?:[ \t]*(?:\n|$))/.exec(source);
          if (match) return { type: 'displayMath', raw: match[0], text: match[1] };
        },
        renderer(token) { return '<div class="math-block">' + math(token.text, true) + '</div>\n'; },
      },
      {
        name: 'inlineMath', level: 'inline',
        start(source) { return source.indexOf('$'); },
        tokenizer(source) {
          const match = /^\$([^$\n]+?)\$(?!\$)/.exec(source);
          if (match) return { type: 'inlineMath', raw: match[0], text: match[1] };
        },
        renderer(token) { return math(token.text, false); },
      },
    ],
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const label = text.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
        const base = slugify(label);
        let number = (ids.get(base) || 0) + 1;
        let id = base + (number === 1 ? '' : '-' + number);
        while (usedIds.has(id)) {
          number += 1;
          id = base + '-' + number;
        }
        ids.set(base, number);
        usedIds.add(id);
        headings.push({ id, label, depth });
        return `<h${depth} id="${id}">${text}</h${depth}>\n`;
      },
    },
  });
  const html = marked.parse(markdown)
    .replace(/<pre>/g, '<pre class="bib-static">')
    .replace(/<blockquote>/g, '<blockquote class="paper-note">');
  return { html, headings };
}

export function readPost(source, slug) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(source);
  if (!match) throw new Error(`${slug}: missing YAML front matter`);
  const meta = parse(match[1]);
  for (const field of ['title', 'date', 'description']) {
    if (typeof meta[field] !== 'string' || !meta[field].trim()) throw new Error(`${slug}: ${field} must be a nonempty string`);
  }
  if (!CATEGORIES.some(category => category.name === meta.category)) throw new Error(`${slug}: unknown category ${meta.category}`);
  const date = new Date(meta.date + 'T00:00:00Z');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.date) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== meta.date) throw new Error(`${slug}: invalid date ${meta.date}`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error(`Invalid post slug: ${slug}`);
  if (!Array.isArray(meta.tags) || meta.tags.some(tag => typeof tag !== 'string' || !tag.trim())) throw new Error(`${slug}: tags must be an array of names`);
  if (meta.source && !/^https:\/\//.test(meta.source)) throw new Error(`${slug}: source must be an HTTPS URL`);
  const body = match[2].trim();
  if (!body) throw new Error(`${slug}: post body is empty`);
  return { ...meta, tags: [...new Set(meta.tags)], slug, body, categoryId: CATEGORIES.find(category => category.name === meta.category).id, url: `${SITE}/blog/${slug}/`, minutes: Math.max(1, Math.ceil(body.split(/\s+/).length / 200)) };
}

function pageHead({ title, description, url, schema, math = false, article = false }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escape(title)} — Som Sagar</title>
<meta name="description" content="${escape(description)}">
<meta name="author" content="Som Sagar">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="theme-color" content="#FAFAFA">
<link rel="canonical" href="${url}">
<meta property="og:type" content="${article ? 'article' : 'website'}">
<meta property="og:site_name" content="Som Sagar">
<meta property="og:title" content="${escape(title)}">
<meta property="og:description" content="${escape(description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/images/profile.jpg">
<meta property="og:image:alt" content="Som Sagar">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${escape(title)}">
<meta name="twitter:description" content="${escape(description)}">
<meta name="twitter:image" content="${SITE}/images/profile.jpg">
<link rel="icon" type="image/png" href="/images/profile_old.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
<link rel="stylesheet" href="/styles.css?v=4">
${math ? '<link rel="stylesheet" href="/blog/assets/katex/katex.min.css">' : ''}
<link rel="stylesheet" href="/blog/blog.css?v=4">
<script type="application/ld+json">${json(schema)}</script>
<script defer src="/blog/blog.js?v=3"></script>
<script data-goatcounter="https://somsagar.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>
</head>
<body class="blog-page${article ? ' paper-page' : ''}">
<script>try{if(localStorage.getItem('theme')==='dark')document.body.classList.add('dark')}catch(e){}</script>
<a class="skip-link" href="#main">Skip to content</a>
<button type="button" id="theme-toggle-btn" title="Toggle dark/light mode" aria-label="Switch color theme" aria-pressed="false"><span class="material-icons" id="themeToggleIcon" aria-hidden="true">light_mode</span></button>
<div class="blog-shell">
<nav class="breadcrumb" aria-label="Breadcrumb"><a href="/">Som Sagar</a> &rsaquo; ${article ? `<a href="/blog/">Blog</a> &rsaquo; ${escape(title)}` : 'Blog'}</nav>`;
}

const pageFoot = () => '</div>\n</body>\n</html>\n';
const topicLabels = tags => tags.map(tag => `<span class="topic-tag">${escape(tag)}</span>`).join('');

function openingExcerpt(post) {
  const paragraph = new Marked().lexer(post.body).find(token => token.type === 'paragraph');
  if (!paragraph) return '';
  const textFrom = tokens => tokens.map(token => token.tokens ? textFrom(token.tokens) : token.type === 'html' ? '' : token.type === 'br' ? ' ' : token.text || '').join('');
  const text = textFrom(paragraph.tokens || [])
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/\$([^$]+)\$/g, '$1').replace(/\s+/g, ' ').trim();
  return text.length > 180 ? text.slice(0, 180).replace(/\s+\S*$/, '') + '…' : text;
}

function indexPage(posts) {
  const description = 'Notes on research, learning machine learning, reinforcement learning, robotics, and experiences from conferences and travel.';
  const schema = { '@context': 'https://schema.org', '@type': 'Blog', name: 'Som Sagar — Blog', url: `${SITE}/blog/`, description, author: { '@type': 'Person', name: 'Som Sagar', url: SITE + '/' }, blogPost: posts.map(post => ({ '@type': 'BlogPosting', headline: post.title, url: post.url, datePublished: post.date })) };
  return pageHead({ title: 'Blog', description, url: `${SITE}/blog/`, schema }) + `
<main id="main" class="blog-index">
  <div class="blog-intro"><h1 class="site-name">Blog</h1><p class="paper-meta blog-count">${posts.length} posts</p></div>
  <div id="collections">${CATEGORIES.map(category => {
    const entries = posts.filter(post => post.categoryId === category.id);
    return `<section class="blog-group" id="${category.id}" aria-labelledby="${category.id}-heading">
      <div class="group-heading"><h2 id="${category.id}-heading">${escape(category.name)}</h2><span class="paper-meta group-count">${entries.length} ${entries.length === 1 ? 'post' : 'posts'}</span></div>
      <div class="post-list">${entries.length ? entries.map(post => `<article class="post-entry"><div class="paper-meta entry-meta"><time datetime="${post.date}">${prettyDate(post.date)}</time><span>${post.minutes} min read</span></div><h3 class="pub-title"><a href="/blog/${post.slug}/">${escape(post.title)}</a></h3><p class="post-excerpt">${escape(openingExcerpt(post))}</p><div class="topics topic-tags">${topicLabels(post.tags)}</div></article>`).join('\n') : '<div class="collection-empty"><p class="paper-meta">Still thinking/writing.</p></div>'}</div>
    </section>`;
  }).join('\n')}
  </div>
</main>` + pageFoot();
}

function postPage(post, posts) {
  const { html, headings } = renderMarkdown(post.body);
  const schema = { '@context': 'https://schema.org', '@type': 'BlogPosting', '@id': post.url + '#article', headline: post.title, description: post.description, datePublished: post.date, url: post.url, mainEntityOfPage: post.url, inLanguage: 'en', articleSection: post.category, keywords: post.tags, author: { '@type': 'Person', name: 'Som Sagar', url: SITE + '/' }, isPartOf: { '@type': 'Blog', name: 'Som Sagar — Blog', url: SITE + '/blog/' } };
  const related = posts.filter(other => other.slug !== post.slug && other.category === post.category).map(other => ({ post: other, overlap: other.tags.filter(tag => post.tags.includes(tag)).length })).sort((a, b) => b.overlap - a.overlap || b.post.date.localeCompare(a.post.date)).slice(0, 3);
  return pageHead({ title: post.title, description: post.description, url: post.url, schema, math: /class="katex/.test(html), article: true }) + `
<main id="main" class="post-main">
  <article>
    <header class="post-heading"><h1>${escape(post.title)}</h1><p class="paper-meta post-meta"><span>Som Sagar</span><time datetime="${post.date}">${prettyDate(post.date)}</time><span>${escape(post.category)}</span><span>${post.minutes} min read</span></p><div class="topics topic-tags">${topicLabels(post.tags)}</div></header>
    ${headings.length >= 3 ? `<details class="post-toc"><summary>On this page</summary><ol>${headings.map(heading => `<li data-depth="${heading.depth}"><a href="#${heading.id}">${escape(heading.label)}</a></li>`).join('')}</ol></details>` : ''}
    <div class="post-content">${html}</div>
  </article>
  ${related.length ? `<aside class="related-notes" aria-labelledby="related-heading"><h2 id="related-heading">Related posts</h2><ul>${related.map(({ post: other }) => `<li><a href="/blog/${other.slug}/">${escape(other.title)}</a></li>`).join('')}</ul></aside>` : ''}
  <p><a class="btn" href="/blog/"><span class="material-icons" aria-hidden="true">arrow_back</span> All posts</a></p>
</main>` + pageFoot();
}

function rssFeed(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>Som Sagar — Blog</title><link>${SITE}/blog/</link><description>Research, learning, and conferences &amp; travel.</description><language>en</language><atom:link href="${SITE}/blog/feed.xml" rel="self" type="application/rss+xml"/>
${posts.map(post => `<item><title>${escape(post.title)}</title><link>${post.url}</link><guid isPermaLink="true">${post.url}</guid><description>${escape(post.description)}</description><pubDate>${new Date(post.date + 'T00:00:00Z').toUTCString()}</pubDate><category>${escape(post.category)}</category>${post.tags.map(tag => `<category>${escape(tag)}</category>`).join('')}</item>`).join('\n')}
</channel></rss>\n`;
}

export async function buildBlog({ root = ROOT, copyMathAssets = true } = {}) {
  const content = join(root, 'content', 'blog');
  const files = (await readdir(content)).filter(file => file.endsWith('.md')).sort();
  const posts = await Promise.all(files.map(async file => readPost(await readFile(join(content, file), 'utf8'), file.slice(0, -3))));
  posts.sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
  // Render every post before writing output, so a bad equation fails the build
  // before it can leave a mixture of old and new article pages behind.
  const pages = posts.map(post => ({ post, html: postPage(post, posts) }));
  await mkdir(join(root, 'blog'), { recursive: true });
  await writeFile(join(root, 'blog', 'index.html'), indexPage(posts));
  await writeFile(join(root, 'blog', 'feed.xml'), rssFeed(posts));
  for (const { post, html } of pages) {
    const directory = join(root, 'blog', post.slug);
    await mkdir(directory, { recursive: true });
    await writeFile(join(directory, 'index.html'), html);
  }
  if (copyMathAssets) {
    const target = join(root, 'blog', 'assets', 'katex');
    const source = join(ROOT, 'node_modules', 'katex');
    await mkdir(target, { recursive: true });
    await copyFile(join(source, 'dist', 'katex.min.css'), join(target, 'katex.min.css'));
    await cp(join(source, 'dist', 'fonts'), join(target, 'fonts'), { recursive: true });
    await copyFile(join(source, 'LICENSE'), join(target, 'LICENSE'));
  }
  let sitemap;
  try { sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>\n'; }
  const existingUrls = (sitemap.match(/<url>[\s\S]*?<\/url>/g) || []).filter(entry => !entry.includes(`<loc>${SITE}/blog/`));
  const urls = [{ url: `${SITE}/blog/`, date: new Date().toISOString().slice(0, 10) }, ...posts.map(post => ({ url: post.url, date: post.date }))];
  const blogUrls = urls.map(({ url, date }) => `<url>\n    <loc>${url}</loc>\n    <lastmod>${date}</lastmod>\n  </url>`);
  sitemap = sitemap.match(/^[\s\S]*?<urlset\b[^>]*>/)[0] + '\n' + [...existingUrls, ...blogUrls].map(entry => '  ' + entry).join('\n') + '\n</urlset>\n';
  await writeFile(join(root, 'sitemap.xml'), sitemap);
  return posts;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const posts = await buildBlog();
  console.log(`Built ${posts.length} blog posts, the collection index, RSS feed, and sitemap.`);
}
