#!/usr/bin/env node
/**
 * Servidor de desarrollo sin dependencias para previsualizar dist/.
 * Imita a Apache en cPanel: "index.html" como documento por defecto y, si una ruta no existe,
 * el 404.html del idioma correspondiente (raíz para inglés, /es/ para español).
 *
 *   node serve.js            → http://localhost:4321/
 *   PORT=8080 node serve.js
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { ROOT, LANGS } from "./lib/content.js";

const DIST = path.join(ROOT, "dist");
const PORT = Number(process.env.PORT || 4321);
// Idiomas no-default ordenados por basePath más largo primero, para no confundir /es/ con /esperanto/.
const nonDefaultLangs = LANGS.filter((l) => l.basePath).sort((a, b) => b.basePath.length - a.basePath.length);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
    const langBase = nonDefaultLangs.find((l) => urlPath === l.basePath || urlPath.startsWith(l.basePath + "/"))?.basePath || "";

    let filePath = path.normalize(path.join(DIST, urlPath));
    if (!filePath.startsWith(DIST) || path.basename(filePath).startsWith(".")) {
      res.writeHead(403).end();
      return;
    }
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      if (!urlPath.endsWith("/")) {
        res.writeHead(301, { Location: urlPath + "/" }).end();
        return;
      }
      filePath = path.join(filePath, "index.html");
    }
    if (!fs.existsSync(filePath)) {
      filePath = path.join(DIST, langBase, "404.html");
      res.statusCode = 404;
    }
    res.setHeader("Content-Type", MIME[path.extname(filePath)] || "application/octet-stream");
    fs.createReadStream(filePath).pipe(res);
  })
  .listen(PORT, () => console.log(`▶ Blog en http://localhost:${PORT}/  (sirviendo dist/; ${LANGS.map((l) => `${l.code} → ${l.basePath || "/"}`).join(", ")})`));
