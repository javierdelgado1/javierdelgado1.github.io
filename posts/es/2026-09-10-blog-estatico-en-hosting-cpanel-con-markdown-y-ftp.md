---
title: Un blog estático en hosting compartido cPanel: Markdown, Node y deploy por FTP
description: Cómo funciona este blog: entradas en Markdown, un generador en Node sin frameworks, un .htaccess para Apache y un script que sube por FTP solo los archivos que cambiaron. Todo en un hosting cPanel normal.
date: 2026-09-10
category: Herramientas
tags: [cpanel, ftp, markdown, node, seo, hosting]
cover: /assets/img/cover-cpanel.jpg
coverAlt: Cuaderno y taza de café sobre un escritorio
author: Javier Delgado
translationKey: static-blog-cpanel-ftp
keyPoints:
  - No hace falta un servicio "moderno" para publicar un blog estático; un hosting cPanel con FTP sirve perfectamente.
  - Las entradas se escriben en Markdown con un encabezado de metadatos y un script de Node genera el HTML completo.
  - Un archivo .htaccess se encarga de la página 404, los tipos MIME, la caché, la compresión y la redirección a HTTPS.
  - El deploy compara hashes con un manifiesto guardado en el servidor y solo transfiere lo que cambió.
  - Cada entrada también se publica en Markdown limpio y en llms.txt para que los asistentes de IA la citen bien.
---

Este blog vive en un **hosting compartido con cPanel**, el mismo tipo de plan que se contrata por unos pocos dólares al mes y que no ofrece Node en el servidor, ni CI, ni nada parecido a Netlify o Vercel. Aun así, publicar un blog estático ahí es sencillo: el HTML se genera en mi computadora y se sube por FTP. Aquí explico cómo está montado, por si quieres replicarlo.

## Por qué estático y por qué cPanel

Un blog personal no necesita base de datos ni panel de administración. Con archivos HTML:

- No hay nada que actualizar ni parchear en el servidor (adiós a los avisos de "WordPress necesita actualizarse").
- La página carga en milisegundos, porque Apache solo tiene que servir archivos.
- El contenido está en git, en texto plano, y se puede editar con cualquier editor.

Y cPanel, con todos sus años, tiene lo único que hace falta: un servidor Apache que sirve carpetas, soporta `.htaccess` y acepta subidas por FTP.

## Escribir: Markdown con front matter

Cada entrada es un archivo en `posts/<idioma>/` con un encabezado de metadatos (front matter) y el contenido en Markdown:

```markdown
---
title: Título de la entrada
description: Resumen de 140-160 caracteres para Google y redes.
date: 2026-09-10
category: Herramientas
tags: [cpanel, ftp]
cover: /assets/img/mi-portada.jpg
keyPoints:
  - Primera idea clave.
  - Segunda idea clave.
---

Contenido en **Markdown**…
```

La URL sale del nombre del archivo: `posts/es/2026-09-10-mi-titulo.md` se publica en `/es/posts/mi-titulo/`. Si el archivo tiene `draft: true`, no se publica. Un comando (`npm run new -- "Título" --lang es`) crea el archivo con la plantilla lista.

## Generar: un script de Node sin frameworks

El generador es un único archivo, `build.js`, que hace tres cosas: lee los `.md`, los convierte a HTML con [marked](https://marked.js.org/) y los inserta en plantillas HTML con un motor de variables mínimo (`{{ titulo }}`, `{{#if}}`, `{{#each}}`). El resultado va a `dist/`:

```text
dist/
├── index.html                  portada (paginada en /page/2/, /page/3/…)
├── posts/<slug>/index.html     cada entrada
├── posts/<slug>.md             la misma entrada en Markdown limpio
├── categoria/<nombre>/         listados por categoría (category/<name>/ en inglés)
├── assets/                     css, js, imágenes
├── sitemap.xml · rss.xml · robots.txt · llms.txt · 404.html
└── .htaccess                   configuración de Apache
```

Sin Jekyll, Hugo ni Astro. No tengo nada en contra de ellos, pero para un blog con un diseño propio (el mismo del portafolio) me resultó más rápido escribir 500 líneas de JavaScript que aprender la forma de hacer plantillas de cada herramienta. Y `npm run dev` levanta un servidor local que imita a Apache para revisar el resultado antes de subirlo.

## Configurar Apache: el archivo .htaccess

Aquí está la diferencia con un CDN moderno: en cPanel todo se configura con un `.htaccess` que el generador escribe automáticamente en `dist/`. Lo esencial:

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

Las URLs limpias (`/posts/mi-titulo/`) funcionan solas porque cada entrada es una carpeta con su `index.html`. El CSS y el JS llevan `?v=<id-del-build>` en la URL, así que pueden cachearse un año sin miedo a servir versiones viejas.

## Publicar: FTP incremental con un manifiesto

Subir todo el `dist/` en cada cambio es lento por FTP. En su lugar, el script de deploy guarda en el servidor un archivo `.deploy-manifest.json` con el hash SHA-1 de cada archivo subido. En el siguiente deploy:

1. Descarga el manifiesto y calcula los hashes de `dist/`.
2. Sube solo los archivos nuevos o modificados.
3. Borra del servidor los archivos que estaban en el manifiesto y ya no existen (por ejemplo, una entrada eliminada). Nunca toca archivos que no subió él.
4. Sube el manifiesto actualizado.

Corregir una errata en una entrada supone subir dos archivos (el HTML y el `.md`) más los feeds, no cientos. El cliente FTP es el paquete [basic-ftp](https://github.com/patrickjuchli/basic-ftp) de Node y las credenciales viven en un `.env` que no se versiona:

```bash
npm run deploy:dry   # conecta y muestra qué subiría, sin tocar nada
npm run deploy       # build + subida incremental
```

## SEO y asistentes de IA

Como el HTML se genera completo, es fácil incluir lo que los buscadores esperan: `canonical`, Open Graph, datos estructurados JSON-LD (`BlogPosting`, `BreadcrumbList`, `FAQPage` a partir de la sección de preguntas frecuentes), `sitemap.xml` y RSS.

Y para los asistentes de IA (ChatGPT, Claude, Perplexity), que cada vez envían más tráfico, el blog publica:

- `/llms.txt`, un índice del sitio en el formato de [llmstxt.org](https://llmstxt.org).
- `/llms-full.txt`, con todo el contenido en un solo Markdown.
- Cada entrada en `/posts/<slug>.md`, enlazada desde el HTML con `<link rel="alternate" type="text/markdown">`.
- Un bloque "En resumen" al inicio de cada artículo con las ideas clave.

## Preguntas frecuentes

### ¿Funciona en un subdominio o solo en la raíz?

En ambos. El generador tiene un `basePath` configurable por idioma: vacío para el idioma por defecto (por ejemplo, inglés en la raíz de `blog.midominio.com`), o `/es` para el resto. Todas las rutas internas, el `.htaccess`, el `hreflang` y el sitemap se ajustan solos.

### ¿Qué pasa si el hosting no soporta FTPS?

El script funciona con FTP plano, FTPS explícito o implícito; se elige con una variable en `.env`. Si el certificado del hosting no coincide con el nombre del servidor, otra variable permite aceptarlo.

### ¿Cómo agrego imágenes a una entrada?

Se copian a `assets/img/` y se referencian como `/assets/img/archivo.jpg`. Conviene mantener las portadas por debajo de 250 KB. Si reemplazas una imagen, usa un nombre nuevo: las imágenes se cachean un mes.

### ¿Puedo usar este sistema con otro diseño?

Sí. Las plantillas están en `layout/` (cabecera, pie, tarjeta de entrada, página de entrada) y los estilos en un único CSS sin frameworks. Cambiar el diseño es editar esos archivos.

## Conclusión

Un hosting compartido no es un límite para tener un blog rápido, bien posicionado y fácil de mantener. Markdown para escribir, un script de Node para generar, `.htaccess` para configurar Apache y FTP incremental para publicar: cuatro piezas pequeñas que se entienden completas.
