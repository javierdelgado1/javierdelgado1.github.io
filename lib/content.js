/**
 * Utilidades compartidas entre build.js, serve.js, new-post.js y lib/ftp-deploy.js:
 * configuración del sitio, lectura de posts/*.md, front matter, slugs, URLs y limpieza de texto.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const POSTS_DIR = path.join(ROOT, "posts");

export const site = JSON.parse(fs.readFileSync(path.join(ROOT, "site.config.json"), "utf8"));
// basePath: "" si el blog vive en la raíz del dominio (subdominio), "/blog" si vive en una subcarpeta.
site.basePath = String(site.basePath || "").replace(/\/+$/, "");
site.baseUrl = String(site.baseUrl || "").replace(/\/+$/, "");

const isExternal = (p) => /^(https?:)?\/\//i.test(p) || /^(mailto|tel|data):/i.test(p) || String(p).startsWith("#");

/** Ruta relativa al dominio, con el basePath delante: "/posts/x/" → "/blog/posts/x/". */
export const href = (p) => (isExternal(p) ? p : site.basePath + p);

/** URL absoluta: "/posts/x/" → "https://javierdelgado.com.ve/blog/posts/x/". */
export const absUrl = (p) => (isExternal(p) ? p : site.baseUrl + p);

export const escapeHtml = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
export const stripTags = (s) => String(s).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
export const decodeEntities = (s) =>
  String(s).replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

export const slugify = (s) =>
  String(s)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Front matter: clave: valor | clave: [a, b] | true/false | listas YAML con "- item"
export function parseFrontMatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw };
  const meta = {};
  let listKey = null;
  for (const line of m[1].split(/\r?\n/)) {
    const li = line.match(/^\s+-\s+(.*)$/);
    if (li && listKey) {
      meta[listKey].push(li[1].trim().replace(/^["']|["']$/g, ""));
      continue;
    }
    const mm = line.match(/^([\w-]+)\s*:\s*(.*)$/);
    if (!mm) continue;
    let [, k, v] = mm;
    v = v.trim();
    listKey = null;
    if (v === "") {
      meta[k] = [];
      listKey = k;
    } else if (/^\[.*\]$/.test(v)) {
      meta[k] = v.slice(1, -1).split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
    } else if (/^(true|false)$/i.test(v)) {
      meta[k] = v.toLowerCase() === "true";
    } else {
      meta[k] = v.replace(/^["']|["']$/g, "");
    }
  }
  return { meta, body: m[2] };
}

/** Lee posts/*.md y devuelve los publicados (sin draft), sin renderizar. */
export function loadPostSources({ includeDrafts = false } = {}) {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const out = [];
  for (const file of fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"))) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
    const { meta, body } = parseFrontMatter(raw);
    if (meta.draft === true && !includeDrafts) continue;
    if (!meta.title) {
      console.warn(`⚠  ${file}: falta "title" en el front matter, se omite.`);
      continue;
    }
    const fileDate = file.match(/^(\d{4}-\d{2}-\d{2})/)?.[1];
    out.push({
      file,
      meta,
      body,
      date: meta.date || fileDate || new Date().toISOString().slice(0, 10),
      slug: meta.slug || slugify(file.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.md$/, "")),
    });
  }
  return out.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

/** Carga .env (clave=valor) en process.env. Los valores del archivo tienen prioridad. */
export function loadDotEnv(file = path.join(ROOT, ".env")) {
  if (!fs.existsSync(file)) return false;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let v = m[2].trim();
    if (/^(["']).*\1$/.test(v)) v = v.slice(1, -1);
    else v = v.replace(/\s+#.*$/, "");
    process.env[m[1]] = v;
  }
  return true;
}
