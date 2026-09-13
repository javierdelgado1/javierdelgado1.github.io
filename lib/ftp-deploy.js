#!/usr/bin/env node
/**
 * Publica dist/ en el hosting cPanel por FTP (o FTPS) de forma incremental.
 *
 *   node lib/ftp-deploy.js               sube lo nuevo/modificado y borra lo que ya no existe
 *   node lib/ftp-deploy.js --dry-run     conecta y compara, pero no sube ni borra nada
 *   node lib/ftp-deploy.js --force       resube todos los archivos
 *   node lib/ftp-deploy.js --no-delete   no borra archivos remotos
 *   node lib/ftp-deploy.js --create      crea REMOTE_DIR si no existe (por defecto se detiene y muestra la raíz)
 *   node lib/ftp-deploy.js --verbose     muestra el diálogo FTP
 *
 * Cómo sabe qué cambió: guarda en el servidor un archivo .deploy-manifest.json con el hash
 * (sha1) de cada archivo subido. En cada deploy lo descarga, lo compara con dist/ y sólo
 * transfiere las diferencias. Sólo borra archivos que él mismo subió antes (están en el
 * manifiesto), nunca toca otros archivos que existan en la carpeta remota.
 *
 * Variables (.env): USERNAME, PASSWORD, SERVERFTP, PORT, REMOTE_DIR, FTP_SECURE, FTP_INSECURE_TLS
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { Readable, Writable } from "node:stream";
import { Client } from "basic-ftp";
import { ROOT, loadDotEnv } from "./content.js";

loadDotEnv();

const DIST = path.join(ROOT, "dist");
const MANIFEST = ".deploy-manifest.json";
const args = new Set(process.argv.slice(2));
const DRY = args.has("--dry-run");
const FORCE = args.has("--force");
const NO_DELETE = args.has("--no-delete");
const CREATE = args.has("--create");
const VERBOSE = args.has("--verbose") || process.env.FTP_DEBUG === "1";

const env = (k, def = "") => (process.env[k] === undefined || process.env[k] === "" ? def : process.env[k]);
const secureMode = env("FTP_SECURE", "off").toLowerCase();
const cfg = {
  host: env("SERVERFTP"),
  port: Number(env("PORT", "21")) || 21,
  user: env("USERNAME"),
  password: env("PASSWORD"),
  remoteDir: "/" + env("REMOTE_DIR", "/").replace(/^\/+|\/+$/g, ""),
  secure: secureMode === "implicit" ? "implicit" : secureMode === "explicit" || secureMode === "true" || secureMode === "on",
  insecureTls: env("FTP_INSECURE_TLS", "0") === "1",
};

// Ruta remota absoluta de un archivo/carpeta relativo a dist/ (REMOTE_DIR puede ser "/")
const rp = (rel) => (cfg.remoteDir === "/" ? `/${rel}` : `${cfg.remoteDir}/${rel}`);

const log = (s) => console.log(`\x1b[1;35m▶\x1b[0m ${s}`);
const ok = (s) => console.log(`\x1b[1;32m✔\x1b[0m ${s}`);
const warn = (s) => console.log(`\x1b[1;33m!\x1b[0m ${s}`);
const fail = (s) => {
  console.error(`\x1b[1;31m✖\x1b[0m ${s}`);
  process.exit(1);
};
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

// ───────────────────────────── local ─────────────────────────────
function walk(dir, base = dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === ".DS_Store" || e.name === "Thumbs.db") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, base, out);
    else out.push(path.relative(base, p).split(path.sep).join("/"));
  }
  return out.sort();
}
const sha1 = (p) => crypto.createHash("sha1").update(fs.readFileSync(p)).digest("hex");

function localManifest() {
  const files = {};
  for (const rel of walk(DIST)) {
    const abs = path.join(DIST, rel);
    files[rel] = { sha1: sha1(abs), size: fs.statSync(abs).size };
  }
  return { version: 1, generatedAt: new Date().toISOString(), files };
}

// ───────────────────────────── remoto ─────────────────────────────
async function readRemoteManifest(client) {
  const chunks = [];
  const sink = new Writable({
    write(chunk, _enc, cb) {
      chunks.push(chunk);
      cb();
    },
  });
  try {
    await client.downloadTo(sink, MANIFEST);
    const parsed = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    return parsed && parsed.files ? parsed : null;
  } catch (e) {
    if (VERBOSE) console.log(`   (sin manifiesto remoto: ${e.message})`);
    return null;
  }
}

async function main() {
  if (!cfg.host || !cfg.user || !cfg.password) fail("Faltan SERVERFTP, USERNAME o PASSWORD (revisa .env / .env.example)");
  if (!fs.existsSync(path.join(DIST, "index.html"))) fail("dist/index.html no existe. Ejecuta npm run build.");

  const local = localManifest();
  const localFiles = Object.keys(local.files);
  const totalBytes = localFiles.reduce((n, f) => n + local.files[f].size, 0);
  log(`dist/: ${localFiles.length} archivos (${kb(totalBytes)})`);
  log(`Servidor: ${cfg.user}@${cfg.host}:${cfg.port} · ${cfg.secure ? `FTPS ${cfg.secure === "implicit" ? "implícito" : "explícito"}` : "FTP"} · carpeta remota: ${cfg.remoteDir}${DRY ? " · DRY-RUN" : ""}`);

  const client = new Client(60_000);
  client.ftp.verbose = VERBOSE;
  try {
    await client.access({
      host: cfg.host,
      port: cfg.port,
      user: cfg.user,
      password: cfg.password,
      secure: cfg.secure,
      secureOptions: cfg.secure ? { rejectUnauthorized: !cfg.insecureTls, servername: cfg.host } : undefined,
    });
  } catch (e) {
    fail(`No se pudo conectar/autenticar: ${e.message}`);
  }
  ok("Conectado");

  // Carpeta remota
  let remoteExists = true;
  try {
    await client.cd(cfg.remoteDir);
  } catch {
    remoteExists = false;
  }
  if (!remoteExists) {
    warn(`La carpeta remota ${cfg.remoteDir} no existe. Contenido de la raíz del FTP para orientarte:`);
    await client.cd("/");
    for (const item of await client.list()) console.log(`   ${item.isDirectory ? "📁" : "📄"} ${item.name}`);
    if (!DRY && !CREATE) {
      client.close();
      fail(
        "No se creó nada. Si la raíz del FTP ya es el document root del blog (cuenta FTP enjaulada), usa REMOTE_DIR=/ ;\n  si de verdad quieres crear esa carpeta, vuelve a ejecutar con --create.",
      );
    }
    if (!DRY) {
      log(`Creando ${cfg.remoteDir}`);
      await client.ensureDir(cfg.remoteDir);
    }
  }

  // Diferencias
  const remote = remoteExists ? await readRemoteManifest(client) : null;
  const remoteFiles = remote ? remote.files : {};
  if (!remote) log(FORCE ? "Modo --force: se suben todos los archivos" : "Sin manifiesto remoto: primer deploy, se suben todos los archivos");

  const toUpload = localFiles.filter((f) => FORCE || !remoteFiles[f] || remoteFiles[f].sha1 !== local.files[f].sha1);
  const toDelete = NO_DELETE ? [] : Object.keys(remoteFiles).filter((f) => !local.files[f]);
  const uploadBytes = toUpload.reduce((n, f) => n + local.files[f].size, 0);

  log(`A subir: ${toUpload.length} archivo(s) (${kb(uploadBytes)}) · a borrar: ${toDelete.length} · sin cambios: ${localFiles.length - toUpload.length}`);
  const preview = (list, mark) => list.slice(0, 40).forEach((f) => console.log(`   ${mark} ${f}`)) || (list.length > 40 && console.log(`   … y ${list.length - 40} más`));
  if (DRY || VERBOSE) {
    preview(toUpload, "+");
    preview(toDelete, "-");
  }

  if (DRY) {
    client.close();
    ok("Dry-run terminado. No se subió ni borró nada.");
    return;
  }

  // Subida (crea carpetas según haga falta)
  let cwd = null;
  const knownDirs = new Set();
  const enterDir = async (absDir) => {
    if (cwd === absDir) return;
    if (knownDirs.has(absDir)) await client.cd(absDir);
    else {
      await client.ensureDir(absDir);
      knownDirs.add(absDir);
    }
    cwd = absDir;
  };
  let done = 0;
  const t0 = Date.now();
  for (const rel of toUpload) {
    const dir = path.posix.dirname(rel);
    const absDir = dir === "." ? cfg.remoteDir : rp(dir);
    await enterDir(absDir);
    await client.uploadFrom(path.join(DIST, rel), path.posix.basename(rel));
    done++;
    console.log(`   ↑ [${String(done).padStart(String(toUpload.length).length)}/${toUpload.length}] ${rel} (${kb(local.files[rel].size)})`);
  }

  // Borrado de lo que ya no existe (sólo archivos registrados en el manifiesto anterior)
  for (const rel of toDelete) {
    try {
      await client.remove(rp(rel));
      console.log(`   ✗ ${rel}`);
    } catch (e) {
      warn(`No se pudo borrar ${rel}: ${e.message}`);
    }
  }
  // Carpetas que quedaron vacías (RMD falla si no están vacías; se ignora)
  const localDirs = new Set(localFiles.map((f) => path.posix.dirname(f)));
  const emptyCandidates = [...new Set(toDelete.map((f) => path.posix.dirname(f)))]
    .filter((d) => d !== "." && ![...localDirs].some((ld) => ld === d || ld.startsWith(d + "/")))
    .sort((a, b) => b.split("/").length - a.split("/").length);
  for (const d of emptyCandidates) {
    try {
      await client.send(`RMD ${rp(d)}`, true);
    } catch {
      /* no vacía o inexistente */
    }
  }

  // Manifiesto actualizado
  await enterDir(cfg.remoteDir);
  await client.uploadFrom(Readable.from([JSON.stringify(local, null, 2)]), MANIFEST);
  client.close();
  ok(`Deploy listo: ${toUpload.length} subido(s), ${toDelete.length} borrado(s) en ${((Date.now() - t0) / 1000).toFixed(1)} s`);
}

main().catch((e) => fail(e.message || String(e)));
