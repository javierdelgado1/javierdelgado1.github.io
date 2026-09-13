# Blog de Javier Delgado

Blog estático (HTML puro) para un **hosting compartido con cPanel**, publicado por FTP.
Replica el diseño del portafolio (template "I'm Mat", tema azul `#3ba3e2`, Roboto + Montserrat,
header con top-bar, foto lateral, secciones blancas sobre fondo fijo, panel móvil y botón de compartir).

> Esta rama (`blog`) es exclusiva del blog. Los archivos del portafolio Vue (`src/`, `index.html`,
> `vite.config.js`, `.github/`, `public/`, `docs/`, `bdd/`) siguen aquí solo porque venían de `master`;
> el blog no los usa y se pueden borrar de la rama cuando quieras.

```
├── site.config.json        ← nombre, dominio (baseUrl/basePath), autor, redes, CTA
├── build.js                ← generador: posts/*.md + layout/ + assets/ → dist/
├── serve.js                ← servidor local para previsualizar dist/ (imita a Apache)
├── new-post.js             ← crea una entrada con el front matter listo
├── deploy.sh               ← build + subida incremental por FTP (usa lib/ftp-deploy.js)
├── lib/
│   ├── content.js          ← config, lectura de posts, front matter, URLs, .env
│   └── ftp-deploy.js       ← cliente FTP/FTPS incremental (basic-ftp)
├── layout/
│   ├── base.html           ← esqueleto HTML (head, SEO, loader, fondo, header, panel, footer)
│   ├── home.html           ← portada / listados (destacado + grid + paginación)
│   ├── post.html           ← plantilla de entrada
│   └── partials/           ← header, panel móvil, sidebar (foto + widgets), footer, tarjeta, CTA, compartir
├── assets/
│   ├── css/blog.css        ← estilos (sin Bootstrap ni frameworks)
│   ├── js/blog.js          ← loader, header fijo, panel móvil, compartir, copiar enlace
│   └── img/                ← avatar, fondo, favicon, portadas
├── posts/                  ← ✍️  AQUÍ VAN LAS ENTRADAS (Markdown)
├── .env                    ← credenciales FTP (no se versiona; plantilla en .env.example)
└── dist/                   ← salida generada (esto es lo que se sube al hosting)
```

## Uso

```bash
npm install          # solo la primera vez (instala "marked" y "basic-ftp")
npm run build        # genera dist/
npm run dev          # genera y sirve en http://localhost:4321
```

## Crear una entrada nueva

```bash
npm run new -- "Título de la entrada" --category "Desarrollo web"
```

Se crea `posts/AAAA-MM-DD-titulo-de-la-entrada.md` con este encabezado:

```markdown
---
title: Título de la entrada
description: Resumen de 140-160 caracteres. Se usa en la tarjeta, en Google y en redes.
date: 2026-09-13
updated: 2026-09-20            # opcional, fecha de última actualización
category: Desarrollo web       # una sola categoría; se crea /categoria/desarrollo-web/
tags: [vue, vite]              # etiquetas (opcional)
cover: /assets/img/mi-portada.jpg   # imagen 1000×693 recomendada (≈ 3:2)
coverAlt: Descripción de la imagen  # texto alternativo (accesibilidad + SEO)
author: Javier Delgado
featured: false                # true → aparece grande en la portada
draft: true                    # true → NO se publica
keyPoints:                     # bloque "En resumen" (opcional, muy recomendado)
  - Primera idea clave.
  - Segunda idea clave.
---

Contenido en **Markdown**…
```

Quita `draft: true`, ejecuta `npm run build` y publica con `npm run deploy`.

- La URL de la entrada sale del nombre del archivo sin la fecha: `posts/2026-09-13-mi-titulo.md` → `/posts/mi-titulo/`.
  Puedes forzarla con `slug: otro-slug`.
- Imágenes: colócalas en `assets/img/` y referéncialas como `/assets/img/archivo.jpg` (el generador
  añade el `basePath` si hace falta). Mantén las portadas por debajo de ~250 KB. Si reemplazas una imagen,
  usa un nombre nuevo: se cachean un mes.
- Si el artículo tiene 3 o más `##`, se genera una tabla de contenidos automática.
- Una sección `## Preguntas frecuentes` con subtítulos `### Pregunta` genera automáticamente el
  esquema `FAQPage` de Google (rich results) y la lee mejor cualquier asistente de IA.
- Las categorías aparecen en la barra de navegación (las 4 con más entradas, `navCategories`),
  en el panel móvil (todas) y en el widget lateral.

## Deploy a cPanel por FTP

1. Copia `.env.example` a `.env` y rellena `USERNAME`, `PASSWORD`, `SERVERFTP`, `PORT` y `REMOTE_DIR`.
2. `REMOTE_DIR` es la carpeta del hosting donde se publica `dist/`, vista desde la raíz del FTP:
   - **Subdominio** (configuración actual): la cuenta FTP ya apunta al *Document Root* de
     `blog.javierdelgado.com.ve`, así que `REMOTE_DIR=/`. Con la cuenta FTP principal de cPanel sería la
     *Document Root* que muestre cPanel → *Dominios* (p. ej. `/blog.javierdelgado.com.ve`).
     En `site.config.json`: `"baseUrl": "https://blog.javierdelgado.com.ve"`, `"basePath": ""`.
   - **Subcarpeta**: `REMOTE_DIR=/public_html/blog` y en `site.config.json`
     `"baseUrl": "https://javierdelgado.com.ve/blog"`, `"basePath": "/blog"`.
   Si la carpeta no existe, el deploy se detiene y lista la raíz del FTP para que compruebes la ruta;
   solo la crea con `./deploy.sh --create`. Ojo: una cuenta FTP enjaulada ve su document root como `/`,
   así que una ruta absoluta de cPanel (`/home/usuario/…`) crearía carpetas anidadas dentro del sitio.
3. Activa el certificado SSL del subdominio en cPanel (AutoSSL) o pon `"forceHttps": false` en `site.config.json`.

```bash
npm run deploy:dry      # conecta, compara y muestra qué subiría/borraría (no toca nada)
npm run deploy          # build + subida incremental
./deploy.sh --no-build  # sube el dist/ existente sin regenerarlo
./deploy.sh --force     # resube todos los archivos
./deploy.sh --no-delete # no borra en el servidor lo que ya no existe en dist/
./deploy.sh --create    # crea REMOTE_DIR si no existe (por defecto se detiene)
./deploy.sh --verbose   # muestra el diálogo FTP (útil si falla la conexión)
```

Cómo funciona el deploy incremental ([lib/ftp-deploy.js](lib/ftp-deploy.js)):

1. Genera `dist/` y calcula el SHA-1 de cada archivo.
2. Descarga del servidor `.deploy-manifest.json` (los hashes del deploy anterior).
3. Sube solo los archivos nuevos o modificados, creando carpetas según haga falta.
4. Borra del servidor los archivos que estaban en el manifiesto y ya no existen en `dist/`
   (entradas eliminadas). **Nunca borra archivos que no subió él.**
5. Sube el manifiesto actualizado. (El `.htaccess` impide que se lea por HTTP.)

Conexión: `FTP_SECURE=explicit` para FTPS si el hosting lo soporta (recomendado); `off` para FTP plano.
Si el certificado no coincide con el nombre del servidor, `FTP_INSECURE_TLS=1`.

### Qué hace el `.htaccess` generado

`build.js` escribe `dist/.htaccess` para Apache/cPanel: `DirectoryIndex`, `Options -Indexes`,
`ErrorDocument 404` → `404.html`, tipo MIME `text/markdown` para los `.md`, UTF-8, redirección a HTTPS
(`forceHttps`), caché larga para css/js (llevan `?v=<build>`), un mes para imágenes, 5 minutos para
HTML/feeds, compresión `mod_deflate` y bloqueo del manifiesto de deploy.

## Qué incluye para SEO

- `<title>`, `meta description`, `canonical`, `robots` con `max-image-preview:large`.
- Open Graph y Twitter Cards con imagen de portada; `article:published_time`, `article:section`, `article:tag`.
- JSON-LD con `@graph`: `Person` (autor), `WebSite`, `Blog` / `CollectionPage`, `BlogPosting`,
  `BreadcrumbList` y `FAQPage` (automático desde "Preguntas frecuentes").
- `sitemap.xml` (con imágenes), `rss.xml` (con contenido completo), `robots.txt`, `404.html` con `noindex`.
- HTML semántico (`article`, `header`, `time`, `nav`, breadcrumbs), jerarquía de encabezados,
  `alt` en imágenes, `loading="lazy"`, `fetchpriority="high"` en la portada, fuentes con `preconnect`.
- URLs limpias, enlaces internos (categorías, relacionados, anterior/siguiente).
- Sin JavaScript pesado: el HTML ya está completo al llegar al navegador.

## Qué incluye para asistentes de IA (ChatGPT, Claude, Gemini, Perplexity…)

- `/llms.txt`: índice del sitio en el formato de [llmstxt.org](https://llmstxt.org).
- `/llms-full.txt`: todo el contenido del blog en un solo Markdown.
- `/posts/<slug>.md`: cada entrada en Markdown limpio, enlazada desde el HTML con
  `<link rel="alternate" type="text/markdown">` y desde el botón "Markdown".
- `robots.txt` permite explícitamente GPTBot, ClaudeBot, Google-Extended, PerplexityBot, etc.
- Bloque **"En resumen"** al inicio (`keyPoints`), FAQ estructurada, fechas explícitas y autor.

## Personalizar

- Dominio, autor, redes, CTA y enlaces del footer: `site.config.json`.
- Colores y tipografía: variables al inicio de `assets/css/blog.css`.
- Imágenes del autor y fondo: `assets/img/avatar*.jpg`, `assets/img/bg.jpg` (copiadas del portafolio).
- Estructura de página: `layout/*.html`. Sintaxis: `{{ var }}`, `{{{ html }}}`, `{{#if x}}…{{else}}…{{/if}}`, `{{#each lista}}…{{/each}}`.
