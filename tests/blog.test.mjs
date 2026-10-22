import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { existsSync } from 'node:fs';

// These exercise the publishing contract: a Markdown post becomes an accessible,
// static page, keeps its math/code, and appears in each of its topic filters.
const loadBuilder = () => import('../scripts/build-blog.mjs');

test('Markdown renders equations without altering dollar signs inside code', async () => {
  const { renderMarkdown } = await loadBuilder();
  const { html } = renderMarkdown('## A result\n\nInline $Q(s,a)$ and $\\alpha$.\n\n$$\nE = mc^2\n$$\n\n```python\nprice = "$5"\nx = "<robot>"\n```');
  assert.equal((html.match(/class="katex"/g) || []).length, 3);
  assert.match(html, /<math /);
  assert.match(html, /price = &quot;\$5&quot;|price = "\$5"/);
  assert.match(html, /&lt;robot&gt;/);
  assert.doesNotMatch(html, /katex-error/);
});

test('heading links remain unique for repeated headings and natural suffix collisions', async () => {
  const { renderMarkdown } = await loadBuilder();
  const { html, headings } = renderMarkdown('## Training\n\nFirst.\n\n## Training\n\nSecond.\n\n## Training 2\n\nThird.\n\n## Training\n\nFourth.');
  assert.deepEqual(headings.map(h => h.id), ['training', 'training-2', 'training-2-2', 'training-3']);
  assert.match(html, /id="training-2"/);
});

test('one post can show multiple plain topic labels without duplicate pages', async () => {
  const { buildBlog } = await loadBuilder();
  const root = await mkdtemp(join(tmpdir(), 'som-blog-test-'));
  await mkdir(join(root, 'content', 'blog'), { recursive: true });
  await writeFile(join(root, 'sitemap.xml'), '<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://somsagar07.github.io/</loc></url></urlset>');
  await writeFile(join(root, 'content', 'blog', 'robot-learning.md'), `---
title: Robot learning
date: 2026-10-22
category: Research
tags: [Reinforcement Learning, Robotics]
description: Learning policies for robots.
---
## Policy learning

A robot learns a policy.
`);
  await buildBlog({ root, copyMathAssets: false });
  assert.ok(existsSync(join(root, 'blog', 'robot-learning', 'index.html')), 'a static post page should be generated');
  const index = await readFile(join(root, 'blog', 'index.html'), 'utf8');
  const post = await readFile(join(root, 'blog', 'robot-learning', 'index.html'), 'utf8');
  const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
  assert.equal((index.match(/class="post-entry"/g) || []).length, 1);
  assert.match(index, /<span class="topic-tag">Reinforcement Learning<\/span>/);
  assert.match(index, /<span class="topic-tag">Robotics<\/span>/);
  assert.doesNotMatch(index, /href="[^\"]*\?topic=/);
  assert.match(index, /id="research"/);
  assert.match(index, /id="learning"/);
  assert.match(index, /id="conferences-travel"/);
  assert.match(post, /<h1>Robot learning<\/h1>/);
  assert.match(post, /A robot learns a policy\./);
  assert.match(post, /"@type": "BlogPosting"/);
  assert.match(post, /rel="canonical" href="https:\/\/somsagar07.github.io\/blog\/robot-learning\/"/);
  assert.match(sitemap, /https:\/\/somsagar07.github.io\/blog\/robot-learning\//);
  await buildBlog({ root, copyMathAssets: false });
  const rebuiltSitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
  assert.equal(rebuiltSitemap.match(/<loc>https:\/\/somsagar07.github.io\/blog\/robot-learning\/<\/loc>/g).length, 1);
  assert.equal(rebuiltSitemap, sitemap, 'rebuilding must not accumulate whitespace or duplicate sitemap entries');
});

test('invalid categories fail instead of silently dropping a post', async () => {
  const { readPost } = await loadBuilder();
  assert.throws(() => readPost('---\ntitle: A post\ndate: 2026-10-22\ncategory: Typo\ntags: []\ndescription: A note.\n---\nContent.', 'a-post'), /category/i);
});

test('invalid publication dates fail instead of generating broken metadata', async () => {
  const { readPost } = await loadBuilder();
  assert.throws(() => readPost('---\ntitle: A post\ndate: 2026-02-30\ncategory: Learning\ntags: []\ndescription: A note.\n---\nContent.', 'a-post'), /date/i);
});
