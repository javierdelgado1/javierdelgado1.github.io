---
title: A static blog on shared cPanel hosting: Markdown, Node, and FTP deploys
description: How this blog works, entries in Markdown, a framework-free Node generator, an .htaccess for Apache, and a script that FTPs only the files that changed. All on ordinary cPanel hosting.
date: 2026-09-10
category: Tools
tags: [cpanel, ftp, markdown, node, seo, hosting]
cover: /assets/img/cover-cpanel.jpg
coverAlt: Notebook and a cup of coffee on a desk
author: Javier Delgado
translationKey: static-blog-cpanel-ftp
keyPoints:
  - You don't need a "modern" service to publish a static blog; cPanel hosting with FTP works perfectly.
  - Posts are written in Markdown with a metadata header, and a Node script generates the full HTML.
  - An .htaccess file handles the 404 page, MIME types, caching, compression, and the HTTPS redirect.
  - Deploys compare hashes against a manifest stored on the server and only transfer what changed.
  - Every post is also published as clean Markdown and in llms.txt so AI assistants can cite it properly.
---

This blog lives on **shared cPanel hosting**, the same kind of plan you get for a few dollars a month, with no Node on the server, no CI, nothing like Netlify or Vercel. Even so, publishing a static blog there is straightforward: the HTML is generated on my machine and uploaded over FTP. Here's how it's put together, in case you want to replicate it.

## Why static, and why cPanel

A personal blog doesn't need a database or an admin panel. With HTML files:

- There's nothing to patch or update on the server (no more "WordPress needs updating" warnings).
- The page loads in milliseconds, because Apache only has to serve files.
- The content lives in git, as plain text, editable with any editor.

And cPanel, for all its age, has exactly what's needed: an Apache server that serves folders, supports `.htaccess`, and accepts FTP uploads.

## Writing: Markdown with front matter

Each post is a file under `posts/<lang>/` with a metadata header (front matter) and Markdown content:

```markdown
---
title: Post title
description: 140-160 character summary for Google and social.
date: 2026-09-10
category: Tools
tags: [cpanel, ftp]
cover: /assets/img/my-cover.jpg
keyPoints:
  - First key idea.
  - Second key idea.
---

Content in **Markdown**…
```

The URL comes from the file name: `posts/en/2026-09-10-my-title.md` publishes at `/posts/my-title/`. If the file has `draft: true`, it isn't published. A command (`npm run new -- "Title"`) creates the file with the template ready to go.

## Generating: a framework-free Node script

The generator is a single file, `build.js`, that does three things: reads the `.md` files, converts them to HTML with [marked](https://marked.js.org/), and inserts them into HTML templates with a minimal variable engine (`{{ title }}`, `{{#if}}`, `{{#each}}`). The output goes to `dist/`:

```text
dist/
├── index.html                  homepage (paginated at /page/2/, /page/3/…)
├── posts/<slug>/index.html     each post
├── posts/<slug>.md             the same post as clean Markdown
├── category/<name>/            category listings (categoria/<nombre>/ in Spanish)
├── assets/                     css, js, images
├── sitemap.xml · rss.xml · robots.txt · llms.txt · 404.html
└── .htaccess                   Apache configuration
```

No Jekyll, Hugo, or Astro. I have nothing against them, but for a blog with a custom design (the same one as the portfolio) it was faster to write 500 lines of JavaScript than to learn each tool's templating conventions. And `npm run dev` spins up a local server that mimics Apache to preview the result before uploading.

## Configuring Apache: the .htaccess file

This is where it differs from a modern CDN: on cPanel, everything is configured with an `.htaccess` file that the generator writes automatically into `dist/`. The essentials:

```apache
Options -Indexes
DirectoryIndex index.html
AddType text/markdown .md
ErrorDocument 404 /404.html

<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} !=on
  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

<IfModule mod_headers.c>
  <FilesMatch "\.(css|js)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  <FilesMatch "\.(html|md|txt|xml)$">
    Header set Cache-Control "public, max-age=300, must-revalidate"
  </FilesMatch>
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript
</IfModule>
```

Clean URLs (`/posts/my-title/`) work on their own because every post is a folder with its own `index.html`. CSS and JS carry `?v=<build-id>` in the URL, so they can be cached for a year without risking stale versions.

## Publishing: incremental FTP with a manifest

Uploading all of `dist/` on every change is slow over FTP. Instead, the deploy script stores a `.deploy-manifest.json` file on the server with the SHA-1 hash of every uploaded file. On the next deploy:

1. It downloads the manifest and computes the hashes of `dist/`.
2. It uploads only new or modified files.
3. It deletes from the server files that were in the manifest and no longer exist (say, a deleted post). It never touches files it didn't upload itself.
4. It uploads the updated manifest.

Fixing a typo in a post means uploading two files (the HTML and the `.md`) plus the feeds, not hundreds. The FTP client is the Node package [basic-ftp](https://github.com/patrickjuchli/basic-ftp), and the credentials live in a `.env` file that isn't versioned:

```bash
npm run deploy:dry   # connects and shows what it would upload, without touching anything
npm run deploy       # build + incremental upload
```

## SEO and AI assistants

Since the HTML is fully generated, it's easy to include everything search engines expect: canonical tags, Open Graph, JSON-LD structured data (`BlogPosting`, `BreadcrumbList`, an automatic `FAQPage` from the FAQ section), `sitemap.xml`, and RSS.

And for AI assistants (ChatGPT, Claude, Perplexity), which send more and more traffic every year, the blog publishes:

- `/llms.txt`, a site index in the [llmstxt.org](https://llmstxt.org) format.
- `/llms-full.txt`, with the entire content in a single Markdown file.
- Every post at `/posts/<slug>.md`, linked from the HTML with `<link rel="alternate" type="text/markdown">`.
- An "In summary" block at the top of every article with the key ideas.

## Frequently asked questions

### Does this work on a subdomain, or only at the root?

Both. The generator has a configurable `basePath` per language: empty if a language lives at `blog.mydomain.com`, or `/es` if it lives at `blog.mydomain.com/es/`. All internal routes, the `.htaccess`, and the sitemap adjust automatically.

### What if the hosting doesn't support FTPS?

The script works with plain FTP, explicit FTPS, or implicit FTPS; it's chosen with an environment variable. If the hosting's certificate doesn't match the server name, another variable lets you accept it anyway.

### How do I add images to a post?

Copy them to `assets/img/` and reference them as `/assets/img/file.jpg`. Keep covers under about 250 KB. If you replace an image, use a new file name: images are cached for a month.

### Can I use this system with a different design?

Yes. The templates live in `layout/` (header, footer, post card, post page) and the styles in a single framework-free CSS file. Changing the design means editing those files.

## Conclusion

Shared hosting isn't a limit on having a fast, well-ranked, easy-to-maintain blog. Markdown for writing, a Node script for generating, `.htaccess` for configuring Apache, and incremental FTP for publishing: four small pieces that are easy to understand in full.
