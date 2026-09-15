---
title: How I migrated my portfolio from Vue 2 to Vue 3 with Vite (without rewriting it from scratch)
description: I migrated a 2017 portfolio (Vue 2, Webpack 3, jQuery) to Vue 3 with Vite in phases, replacing every dead dependency without redoing the design. Here's the plan, the decisions, and what I learned.
date: 2026-09-13
category: Web Development
tags: [vue, vite, javascript, migration, refactor]
cover: /assets/img/cover-vue3.jpg
coverAlt: Desk with a laptop showing code
author: Javier Delgado
translationKey: vue2-to-vue3-migration
featured: true
keyPoints:
  - Before migrating the stack, I closed the security gaps (exposed API key, vulnerable PHP form, dead code).
  - The migration ran on a separate branch and in phases; production never stopped working.
  - I kept the Options API instead of rewriting components; I only changed what Vue 3 actually breaks.
  - Every unmaintained Vue 2 plugin was replaced with a modern alternative or a few lines of my own code.
  - The build moved from Webpack 3 + Babel 6 (which wouldn't even start on Node 17+) to Vite, with automatic deploys via GitHub Actions.
---

My portfolio had run on the same stack for almost ten years: **Vue 2.5, Webpack 3, Babel 6, jQuery 1.12**, and an HTML template bought in 2016. It worked, but it no longer compiled on any modern version of Node, and every dependency had security warnings. Instead of rebuilding it with a new framework, I decided to migrate it to **Vue 3 with Vite** while keeping the design. This post summarizes the method I followed, which applies to any legacy Vue 2 project.

## Start with security, not the framework

The first step wasn't touching Vue. It was reviewing what in the repository could cause harm right now:

- A **Google Maps API key** written into `index.html`, for a map that wasn't even displayed. It was removed from the code, but since it's still in the public git history, the only real fix is to rotate it and restrict it by domain.
- A **PHP contact form** with no validation or protection. The Vue component already sent data to a different backend, so the PHP was dead code and a liability at the same time.
- An integration with the **Twitter API v1.1**, shut down years ago.
- The `dist/` folder checked into git, plus two `.zip` files with copies of the project.

All of that can be cleaned up in an afternoon and doesn't depend on any migration. If the project stalls halfway through, at least it's left more secure than before.

## A phased roadmap on a separate branch

I wrote the plan in a Markdown file inside the repository itself, with checkboxes to track progress. The phases were:

| Phase | Goal | Result |
| --- | --- | --- |
| 0 | Immediate security | API key out of the code, PHP and Twitter removed, artifacts out of git |
| 1 | Environment cleanup | `browserslist` updated, original HTML templates removed, unused imports gone |
| 2 | Vue 3 + Vite scaffolding | New Vite project, components migrated one by one |
| 3 | Dependency replacement | Every Vue 2 plugin replaced or removed |
| 5 | Styles and assets | Pending: SCSS into the Vite pipeline, icons to SVG |
| 6 | Deployment | GitHub Actions publishes `dist/` to GitHub Pages on every push to `master` |

The key was working on a `migration/vue3` branch while `master` kept serving the old site. No "big bang."

## Vue 3 without rewriting components

Vue 3 still supports the **Options API**, so almost every component moved over with minimal changes: `new Vue()` became `createApp()`, filters disappeared, and the `eventBus` (an empty Vue instance in Vue 2) was replaced with [mitt](https://github.com/developit/mitt), which does the same thing in 200 bytes.

What actually took work was everything **jQuery did through `core.js`**, the original template's script: the page loader, the header that pins on scroll, the mobile side panel, and the project modal. Each one was rewritten as Vue behavior:

```js
// App.vue — header pinned once you scroll past the top bar's height (jQuery's job in core.js before)
mounted() {
  document.body.classList.add('loaded')
  this.setHeader()
  window.addEventListener('scroll', this.setHeader, { passive: true })
},
methods: {
  setHeader() {
    const topBar = document.getElementById('top-bar')
    const limit = topBar ? topBar.offsetHeight : 0
    document.body.classList.toggle('sticky-layout', window.scrollY >= limit)
  }
}
```

With that, jQuery, Bootstrap JS, Masonry, Owl Carousel, and Isotope all left the project at once.

## What replaced each Vue 2 dependency

This was the most entertaining part. The rule: if a plugin wasn't updated for Vue 3, find the smallest possible replacement, and if what it does fits in twenty lines, write it yourself.

| Vue 2 | Vue 3 | Note |
| --- | --- | --- |
| `vue-multilanguage` | `vue-i18n` | The `en`/`es` dictionaries moved to `src/i18n.js`; `v-lang.x.y` became `v-html="$t('x.y')"` |
| `vue-carousel` | `@splidejs/vue-splide` | Keeps the same carousel UX |
| `vue-gallery` | `vue-easy-lightbox` | For the certificates gallery |
| `vue-typer` | Custom `Typer.vue` component | Typewriter effect in 40 lines |
| `vueisotope` + Masonry | CSS Grid | The projects layout no longer needs JavaScript |
| `vue-scrollto` | Custom `v-scroll-to` directive | `scrollIntoView({ behavior: 'smooth' })` |
| `vue-router`, `vuex`, `bootstrap-vue` | Nothing | They were installed but never used |

That last row is the most important one: **half the dependencies in an old project usually aren't used**. Before migrating anything, check whether it's actually imported anywhere.

## Vite instead of Webpack 3

The original toolchain (Webpack 3 + Babel 6) broke on Node 17 or newer because of OpenSSL changes. Upgrading Webpack from version 3 to 5 was almost as much work as switching to Vite, so I went straight to Vite:

```js
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  base: './', // relative paths for GitHub Pages
  plugins: [vue()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } }
})
```

The result: `vite build` finishes in a few seconds, producing 240 kB of JavaScript and 306 kB of CSS. The CSS is still large because the original template loads all of Bootstrap 3; trimming it is the next phase.

## Automatic deployment

With Vite, publishing became the easy part: a GitHub Actions workflow installs dependencies, runs `npm run build`, and pushes `dist/` to GitHub Pages on every push to `master`. The `dist/` folder stopped being tracked in git.

## What's still pending

- Move the template's SCSS into the Vite pipeline and remove unused CSS.
- Replace icon fonts (FontAwesome, Themify) with inline SVG.
- Run a Lighthouse audit: performance, accessibility, and SEO.

## Frequently asked questions

### Should I migrate to Vue 3 or rewrite with a different framework?

If the design and components still hold up, migrating is cheaper: Vue 3 keeps the Options API, and most of the code moves over unchanged. Rewriting only makes sense if the design is changing too.

### How long did the migration take?

Phases 0 through 3 (security, cleanup, Vue 3 + Vite, and dependency replacement) were completed over a few work sessions spread across a handful of days, because the plan was written up front and every task was small.

### What do I do about an API key that's stuck in git history?

Rotate it. Deleting it from the current code doesn't help if the repository is public: anyone can read the old commits. Generate a new key and restrict it by domain (HTTP referrer) in the provider's console.

### Is it worth keeping the Options API in Vue 3?

For a migrated project, yes. The Composition API is better for complex, reusable logic, but changing components that already work purely for style adds risk without immediate benefit.

## Conclusion

Migrating a legacy project isn't one big task but many small ones: security first, then cleanup, then scaffolding, then dependencies. Writing the plan into the repository and working on a separate branch made the process predictable and kept the site running the whole time.
