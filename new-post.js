#!/usr/bin/env node
/**
 * Crea una entrada nueva con el front matter listo, en uno o ambos idiomas.
 *
 *   npm run new -- "Post title" --lang en --category "Web development" --key my-post
 *   npm run new -- "Título del post" --lang es --category "Desarrollo web" --key my-post
 *
 * "--key" es el translationKey que vincula la entrada con su traducción en el otro idioma
 * (mismo valor en ambos archivos). Si no se pasa, se genera a partir del slug en inglés/del título.
 */
import fs from "node:fs";
import path from "node:path";
import { POSTS_DIR, site, LANGS, langByCode, slugify } from "./lib/content.js";

const args = process.argv.slice(2);
const title = args.find((a) => !a.startsWith("--"));
if (!title) {
  console.error('Usage: npm run new -- "Post title" [--lang en|es] [--category X] [--key translation-key] [--cover /assets/img/x.jpg]');
  process.exit(1);
}
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : def;
};

const langCode = opt("lang", LANGS.find((l) => l.default)?.code || LANGS[0].code);
const lang = langByCode[langCode];
if (!lang) {
  console.error(`Unknown --lang "${langCode}". Available: ${LANGS.map((l) => l.code).join(", ")}`);
  process.exit(1);
}

const slug = slugify(title);
const translationKey = opt("key", slug);
const date = new Date().toISOString().slice(0, 10);
const dir = path.join(POSTS_DIR, langCode);
const file = path.join(dir, `${date}-${slug}.md`);

if (fs.existsSync(file)) {
  console.error(`Already exists: ${file}`);
  process.exit(1);
}

const isEn = langCode === "en";
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(
  file,
  `---
title: ${title}
description: ${isEn ? "140-160 character summary (shown in the card, Google, and social)." : "Resumen de 140-160 caracteres (aparece en la tarjeta, en Google y en redes)."}
date: ${date}
category: ${opt("category", isEn ? "General" : "General")}
tags: [${isEn ? "web development" : "desarrollo web"}]
cover: ${opt("cover", site.defaultCover)}
coverAlt: ${isEn ? "Cover image description" : "Descripción de la imagen de portada"}
author: ${site.author}
translationKey: ${translationKey}
featured: false
draft: true
keyPoints:
  - ${isEn ? "First key idea of the post." : "Primera idea clave de la entrada."}
  - ${isEn ? "Second key idea." : "Segunda idea clave."}
---

${isEn ? "Write the content here in **Markdown**. Answer the main question in the first paragraph." : "Escribe aquí el contenido en **Markdown**. Responde la pregunta principal en el primer párrafo."}

## ${isEn ? "First section" : "Primer apartado"}

${isEn ? "Section text." : "Texto del apartado."}

## ${isEn ? "Frequently asked questions" : "Preguntas frecuentes"}

### ${isEn ? "A real question people ask?" : "¿Una pregunta real que se haga la gente?"}

${isEn ? "Short, direct answer." : "Respuesta breve y directa."}
`,
);
console.log(`✔ Post created: posts/${langCode}/${path.basename(file)}`);
console.log(`  translationKey: ${translationKey} (use the same value for the ${LANGS.filter((l) => l.code !== langCode).map((l) => l.code).join("/")} translation)`);
console.log(`  Remove "draft: true" when ready and run: npm run build`);
