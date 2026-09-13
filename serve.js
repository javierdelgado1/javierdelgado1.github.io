#!/usr/bin/env node
/**
 * Servidor de desarrollo sin dependencias para previsualizar dist/.
 * Imita a Apache en cPanel: "index.html" como documento por defecto, 404.html para lo que
 * no existe y el blog servido bajo el basePath de site.config.json (p. ej. /blog/).
 *
 *   node serve.js            → http://localhost:4321/<basePath>/
 *   PORT=8080 node serve.js
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { ROOT, site } from "./lib/content.js";

const DIST = path.join(ROOT, "dist");
const PORT = Number(process.env.PORT || 4321);
const BASE = site.basePath; // "" o "/blog"

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
    let urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);

    if (BASE) {
      if (urlPath === "/" || urlPath === BASE) {
        res.writeHead(302, { Location: BASE + "/" }).end();
        return;
      }
      if (!urlPath.startsWith(BASE + "/")) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end(`Fuera del blog. Abre http://localhost:${PORT}${BASE}/`);
        return;
      }
      urlPath = urlPath.slice(BASE.length);
    }

    let filePath = path.normalize(path.join(DIST, urlPath));
    if (!filePath.startsWith(DIST) || path.basename(filePath).startsWith(".")) {
      res.writeHead(403).end();
      return;
    }
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      if (!urlPath.endsWith("/")) {
        res.writeHead(301, { Location: BASE + urlPath + "/" }).end();
        return;
      }
      filePath = path.join(filePath, "index.html");
    }
    if (!fs.existsSync(filePath)) {
      filePath = path.join(DIST, "404.html");
      res.statusCode = 404;
    }
    res.setHeader("Content-Type", MIME[path.extname(filePath)] || "application/octet-stream");
    fs.createReadStream(filePath).pipe(res);
  })
  .listen(PORT, () => console.log(`▶ Blog en http://localhost:${PORT}${BASE}/  (sirviendo dist/)`));
