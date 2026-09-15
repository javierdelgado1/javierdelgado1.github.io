# Blog de Javier Delgado

Blog estático bilingüe (inglés/español, HTML puro) para un **hosting compartido con cPanel**,
publicado por FTP. Replica el diseño del portafolio (template "I'm Mat", tema azul `#3ba3e2`,
Roboto + Montserrat, header con top-bar, foto lateral, secciones blancas sobre fondo fijo, panel
móvil y botón de compartir).

**Inglés es el idioma por defecto** y se sirve en la raíz del dominio; **español vive bajo `/es/`**.
Cada entrada existe como dos archivos independientes (uno por idioma) vinculados por un
`translationKey` común en el front matter — no es necesario traducir todo de inmediato: una entrada
sin traducción simplemente no aparece en el otro idioma.

> Esta rama (`blog`) es exclusiva del blog. Los archivos del portafolio Vue (`src/`, `index.html`,
> `vite.config.js`, `.github/`, `public/`, `docs/`, `bdd/`) siguen aquí solo porque venían de `master`;
> el blog no los usa y se pueden borrar de la rama cuando quieras.

```
├── site.config.json        ← dominio, redes, y "languages": [en, es] con UI y textos por idioma
├── build.js                ← generador: posts/<lang>/*.md + layout/ + assets/ → dist/
├── serve.js                ← servidor local para previsualizar dist/ (imita a Apache)
├── new-post.js             ← crea una entrada con el front matter listo, en el idioma que elijas
├── deploy.sh               ← build + subida incremental por FTP (usa lib/ftp-deploy.js)
├── lib/
│   ├── content.js          ← config, idiomas, lectura de posts, front matter, URLs, .env
│   └── ftp-deploy.js       ← cliente FTP/FTPS incremental (basic-ftp)
├── layout/
│   ├── base.html           ← esqueleto HTML (head, SEO, hreflang, loader, header, panel, footer)
│   ├── home.html           ← portada / listados (destacado + grid + paginación)
│   ├── post.html           ← plantilla de entrada
│   └── partials/           ← header (+selector de idioma), panel móvil, sidebar, footer, tarjeta, CTA, compartir
├── assets/
│   ├── css/blog.css        ← estilos (sin Bootstrap ni frameworks), compartidos entre idiomas
│   ├── js/blog.js          ← loader, header fijo, panel móvil, compartir, copiar enlace
│   └── img/                ← avatar, fondo, favicon, portadas (compartidas entre idiomas)
├── posts/
│   ├── en/                 ← ✍️  entradas en inglés (idioma por defecto)
│   └── es/                 ← ✍️  entradas en español
├── .env                    ← credenciales FTP (no se versiona; plantilla en .env.example)
└── dist/                   ← salida generada (esto es lo que se sube al hosting)
```

## Uso

```bash
npm install          # solo la primera vez (instala "marked" y "basic-ftp")
npm run build        # genera dist/ (ambos idiomas)
npm run dev          # genera y sirve en http://localhost:4321 (/ = inglés, /es/ = español)
```

## Crear una entrada nueva

```bash
npm run new -- "Post title" --lang en --category "Web development" --key my-post
npm run new -- "Título del post" --lang es --category "Desarrollo web" --key my-post
```

- `--lang` es `en` (por defecto) o `es`.
- `--key` es el **translationKey**: usa el mismo valor en ambos idiomas para vincular una entrada
  con su traducción. Si lo omites, se genera a partir del slug — pero entonces debes copiarlo a mano
  en la traducción para que ambas se enlacen entre sí (selector de idioma y `hreflang` de esa entrada).

Se crea `posts/<lang>/AAAA-MM-DD-titulo.md` con este encabezado:

```markdown
---
title: Post title
description: 140-160 character summary (shown in the card, Google, and social).
date: 2026-09-13
updated: 2026-09-20            # optional, last-updated date
category: Web development      # a single category; creates /category/web-development/
tags: [vue, vite]               # tags (optional)
cover: /assets/img/my-cover.jpg # 1000×693 recommended (~3:2), shared across languages
coverAlt: Image description     # alt text (accessibility + SEO)
author: Javier Delgado
translationKey: my-post         # links this entry to its translation in the other language
featured: false                 # true → shown large on the homepage
draft: true                     # true → NOT published
keyPoints:                      # "In summary" block (optional, highly recommended)
  - First key idea.
  - Second key idea.
---

Content in **Markdown**…
```

Quita `draft: true`, ejecuta `npm run build` y publica con `npm run deploy`.

- La URL sale del nombre del archivo sin la fecha: `posts/en/2026-09-13-my-title.md` → `/posts/my-title/`;
  `posts/es/2026-09-13-mi-titulo.md` → `/es/posts/mi-titulo/`. Los slugs **no** tienen que coincidir
  entre idiomas; lo que los vincula es `translationKey`. Puedes forzar el slug con `slug: otro-slug`.
- Si al construir ves `⚠ sin traducción en otro idioma para translationKey "…"`, esa entrada existe
  solo en un idioma — se publica igual, simplemente no aparece en el selector de idioma del otro.
- Imágenes: colócalas en `assets/img/` y referéncialas como `/assets/img/archivo.jpg`. Son compartidas
  entre idiomas (no llevan prefijo `/es/`). Mantén las portadas por debajo de ~250 KB; si reemplazas
  una, usa un nombre nuevo (se cachean un mes).
- Si el artículo tiene 3 o más `##`, se genera una tabla de contenidos automática.
- Una sección de preguntas frecuentes (`## Preguntas frecuentes` en español, `## Frequently asked
  questions` en inglés) con subtítulos `###` genera automáticamente el esquema `FAQPage` de Google
  (rich results) y la lee mejor cualquier asistente de IA.
- Las categorías aparecen en la barra de navegación (las 4 con más entradas, `navCategories`), en el
  panel móvil (todas) y en el widget lateral — con nombre y slug propios por idioma
  (`/category/…` en inglés, `/categoria/…` en español).
- `machineTranslated: true` en el front matter muestra un aviso ("traducido automáticamente…") bajo
  la autoría del post — útil si traduces con IA y quieres ser transparente con el lector.

## Deploy a cPanel por FTP

1. Copia `.env.example` a `.env` y rellena `USERNAME`, `PASSWORD`, `SERVERFTP`, `PORT` y `REMOTE_DIR`.
2. `REMOTE_DIR` es la carpeta del hosting donde se publica `dist/`, vista desde la raíz del FTP:
   - **Subdominio** (configuración actual): la cuenta FTP ya apunta al *Document Root* de
     `blog.javierdelgado.com.ve`, así que `REMOTE_DIR=/`. Con la cuenta FTP principal de cPanel sería la
     *Document Root* que muestre cPanel → *Dominios* (p. ej. `/blog.javierdelgado.com.ve`).
     En `site.config.json`: `"baseUrl": "https://blog.javierdelgado.com.ve"`.
   - **Subcarpeta**: `REMOTE_DIR=/public_html/blog` y en `site.config.json`
     `"baseUrl": "https://javierdelgado.com.ve/blog"` (el idioma por defecto seguiría en `/blog/`,
     español en `/blog/es/`).
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

1. Genera `dist/` (ambos idiomas) y calcula el SHA-1 de cada archivo.
2. Descarga del servidor `.deploy-manifest.json` (los hashes del deploy anterior).
3. Sube solo los archivos nuevos o modificados, creando carpetas según haga falta.
4. Borra del servidor los archivos que estaban en el manifiesto y ya no existen en `dist/`
   (entradas eliminadas, o rutas que cambiaron de idioma/estructura). **Nunca borra archivos que no subió él.**
5. Sube el manifiesto actualizado. (El `.htaccess` impide que se lea por HTTP.)

Conexión: `FTP_SECURE=explicit` para FTPS si el hosting lo soporta (recomendado); `off` para FTP plano.
Si el certificado no coincide con el nombre del servidor, `FTP_INSECURE_TLS=1`.

### Qué hace el `.htaccess` generado

`build.js` escribe `dist/.htaccess` para Apache/cPanel: `DirectoryIndex`, `Options -Indexes`,
`ErrorDocument 404` → `404.html` (usa el 404 del idioma según la ruta), tipo MIME `text/markdown`
para los `.md`, UTF-8, redirección a HTTPS (`forceHttps`), cabecera `Content-Language` (`en` fuera de
`/es/`, `es` dentro), caché larga para css/js (llevan `?v=<build>`), un mes para imágenes, 5 minutos
para HTML/feeds, compresión `mod_deflate` y bloqueo del manifiesto de deploy.

## Qué incluye para SEO

- `<title>`, `meta description`, `canonical` **por idioma**, `robots` con `max-image-preview:large`.
- `hreflang` alternate en cada página (incluido `x-default` apuntando al inglés) y en el `sitemap.xml`
  combinado (anotaciones `xhtml:link`), para que Google entienda que ambas versiones son equivalentes
  y no las trate como contenido duplicado.
- `<html lang="en">` / `<html lang="es">` correcto por página; `og:locale` + `og:locale:alternate`.
- Open Graph y Twitter Cards con imagen de portada; `article:published_time`, `article:section`, `article:tag`.
- JSON-LD con `@graph`: `Person` (autor), `WebSite` (con `inLanguage`), `Blog` / `CollectionPage`,
  `BlogPosting`, `BreadcrumbList` y `FAQPage` (automático desde la sección de preguntas frecuentes).
- Un único `sitemap.xml` con las URLs de ambos idiomas y sus relaciones `hreflang`; `rss.xml` por
  idioma; `robots.txt` único; `404.html` propio por idioma, con `noindex`.
- HTML semántico (`article`, `header`, `time`, `nav`, breadcrumbs), jerarquía de encabezados,
  `alt` en imágenes, `loading="lazy"`, `fetchpriority="high"` en la portada, fuentes con `preconnect`.
- URLs limpias y descriptivas por idioma, enlaces internos (categorías, relacionados, anterior/siguiente).
- Sin JavaScript pesado: el HTML ya está completo al llegar al navegador.

## Qué incluye para asistentes de IA (ChatGPT, Claude, Gemini, Perplexity…)

- `/llms.txt` y `/es/llms.txt`: índice del sitio en cada idioma, formato [llmstxt.org](https://llmstxt.org).
- `/llms-full.txt` y `/es/llms-full.txt`: todo el contenido de ese idioma en un solo Markdown.
- `/posts/<slug>.md` (y su equivalente bajo `/es/`): cada entrada en Markdown limpio, enlazada desde
  el HTML con `<link rel="alternate" type="text/markdown">` y desde el botón "Markdown".
- `robots.txt` permite explícitamente GPTBot, ClaudeBot, Google-Extended, PerplexityBot, etc.
- Bloque **"In summary" / "En resumen"** al inicio (`keyPoints`), FAQ estructurada, fechas explícitas y autor.

## Personalizar

- Dominio, autor, redes: raíz de `site.config.json`.
- Idiomas, navegación, textos de interfaz (`ui.*`), CTA y enlaces del footer **por idioma**:
  `site.config.json` → `languages[]`. Añadir un tercer idioma es agregar un objeto más a ese array
  (con su propio `code`, `basePath`, `htmlLang`, `locale` y bloque `ui`) — el resto del sistema
  (rutas, hreflang, sitemap, feeds, `.htaccess`) se adapta solo.
- Colores y tipografía: variables al inicio de `assets/css/blog.css`.
- Imágenes del autor y fondo: `assets/img/avatar*.jpg`, `assets/img/bg.jpg` — compartidas entre idiomas.
- Estructura de página: `layout/*.html`. Sintaxis: `{{ var }}`, `{{{ html }}}`, `{{#if x}}…{{else}}…{{/if}}`,
  `{{#each lista}}…{{/each}}`. Todo texto de interfaz debe venir de `{{ ui.algo }}`, no escribirse a mano,
  para que la plantilla sirva a ambos idiomas.
