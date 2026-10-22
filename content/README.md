# Writing a blog post

Posts live in `content/blog/`. Each Markdown file becomes a static page at
`/blog/<filename>/`. The HTML output is already generated, so GitHub Pages can
serve it without a Node server or a build workflow.

The root `.nojekyll` file tells GitHub Pages to serve the generated website
directly instead of converting the Markdown sources into extra HTML pages.

## Add a post

1. Copy `content/blog-template.md` to `content/blog/your-post-name.md`.
2. Fill in the metadata and write your post below the second `---` line.
3. Run these commands from the website directory:

   ```sh
   npm ci
   npm run build:blog
   npm test
   python3 -m http.server 8765 --bind 127.0.0.1
   ```

4. Preview at <http://127.0.0.1:8765/blog/>. The build updates the blog index,
   article pages, RSS feed, local math assets, and sitemap. Publishing remains a
   separate step; these commands do not commit or push anything.

After the first setup, only `npm run build:blog` is needed to rebuild your edits.

## Collections and topics

Choose one `category` based on the kind of writing:

- `Research`: experiments, findings, paper explanations, and research ideas.
- `Learning`: tutorials, concepts, and things you are working through.
- `Conferences & Travel`: conference experiences, people, and places.

Use as many `tags` as fit the subject. For example, a research note about robot
policies can use both `Reinforcement Learning` and `Robotics`. The article stays
at one URL with both topics shown as plain labels.

The 18 imported Notion posts retain their original publication dates and content.
They currently occupy Learning (17) and Conferences & Travel (1). Research is
ready for new posts. Robotics is available as a topic; there are no imported
robotics-specific articles.

## Formatting

- Use `##` for main headings and `###` for subsections. The page title supplies
  the only `h1`. Repeated headings automatically get distinct link targets.
- Use `$Q(s,a)$` for inline math and `$$` on separate lines around display math.
  Equations are rendered at build time with accessible MathML, and their fonts
  are stored locally. Invalid LaTeX stops the build with an error.
- Use fenced code blocks with a language, such as `python`.
- Use `>` for a callout, and regular Markdown lists and links.
- Put images in `blog/assets/images/` and link to them with a root-relative path,
  such as `![A description of the figure](/blog/assets/images/your-figure.png)`.
- The optional `source` field keeps an editing reference to the original
  post; it is not displayed in the blog. Omit it for a new post written here.
  Canonical links always point to the GitHub Pages URL.
- Keep dates in quoted `YYYY-MM-DD` format. The filename supplies the URL, so
  choose it carefully before publishing.

To remove a post, delete its Markdown file and its generated `blog/<filename>/`
directory, then rebuild. The generator leaves other directories alone.

Edit the generator in `scripts/build-blog.mjs` for shared page changes;
edit `blog/blog.css` or `blog/blog.js` for styles and controls. Edits made directly
to generated article HTML will be overwritten on the next build.
