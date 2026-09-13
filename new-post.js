#!/usr/bin/env node
/**
 * Crea una entrada nueva con el front matter listo.
 *
 *   npm run new -- "Título de la entrada"
 *   npm run new -- "Título" --category "Desarrollo web" --cover /assets/img/mi-imagen.jpg
 */
import fs from "node:fs";
import path from "node:path";
import { POSTS_DIR, site, slugify } from "./lib/content.js";

const args = process.argv.slice(2);
const title = args.find((a) => !a.startsWith("--"));
if (!title) {
  console.error('Uso: npm run new -- "Título de la entrada" [--category X] [--cover /assets/img/x.jpg]');
  process.exit(1);
}
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] ? args[i + 1] : def;
};

const slug = slugify(title);
const date = new Date().toISOString().slice(0, 10);
const file = path.join(POSTS_DIR, `${date}-${slug}.md`);

if (fs.existsSync(file)) {
  console.error(`Ya existe: ${file}`);
  process.exit(1);
}

fs.mkdirSync(POSTS_DIR, { recursive: true });
fs.writeFileSync(
  file,
  `---
title: ${title}
description: Resumen de 140-160 caracteres (aparece en la tarjeta, en Google y en redes).
date: ${date}
category: ${opt("category", "General")}
tags: [desarrollo web]
cover: ${opt("cover", site.defaultCover)}
coverAlt: Descripción de la imagen de portada
author: ${site.author}
featured: false
draft: true
keyPoints:
  - Primera idea clave de la entrada.
  - Segunda idea clave.
---

Escribe aquí el contenido en **Markdown**. Responde la pregunta principal en el primer párrafo.

## Primer apartado

Texto del apartado.

## Preguntas frecuentes

### ¿Una pregunta real que se haga la gente?

Respuesta breve y directa.
`,
);
console.log(`✔ Entrada creada: posts/${path.basename(file)}\n  Quita "draft: true" cuando esté lista y ejecuta: npm run build`);
