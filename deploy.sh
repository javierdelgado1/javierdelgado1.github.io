#!/usr/bin/env bash
# =============================================================================
# Deploy del blog a un hosting compartido cPanel por FTP/FTPS (incremental)
#
#   ./deploy.sh              build + sube lo que cambió + borra lo que ya no existe
#   ./deploy.sh --dry-run    conecta y muestra qué subiría/borraría, sin tocar nada
#   ./deploy.sh --no-build   sube el dist/ existente sin regenerarlo
#   ./deploy.sh --force      resube todos los archivos aunque no hayan cambiado
#   ./deploy.sh --no-delete  no borra en el servidor los archivos eliminados de dist/
#   ./deploy.sh --create     crea REMOTE_DIR si no existe (por defecto se detiene y muestra la raíz del FTP)
#   ./deploy.sh --verbose    muestra el diálogo FTP completo
#
# Credenciales y carpeta remota: archivo .env (plantilla en .env.example).
# Requiere node >= 18. La subida la hace lib/ftp-deploy.js (paquete basic-ftp).
# =============================================================================
set -euo pipefail
cd "$(dirname "$0")"

log()  { printf '\033[1;35m▶\033[0m %s\n' "$*"; }
ok()   { printf '\033[1;32m✔\033[0m %s\n' "$*"; }
fail() { printf '\033[1;31m✖\033[0m %s\n' "$*" >&2; exit 1; }

# ----------------------------- flags -----------------------------------------
DO_BUILD=1
NODE_ARGS=()
for arg in "$@"; do
  case "$arg" in
    --no-build) DO_BUILD=0 ;;
    --dry-run|--force|--no-delete|--create|--verbose) NODE_ARGS+=("$arg") ;;
    -h|--help) sed -n '2,15p' "$0"; exit 0 ;;
    *) echo "Opción desconocida: $arg" >&2; exit 1 ;;
  esac
done

# ----------------------------- comprobaciones --------------------------------
command -v node >/dev/null || fail "node no encontrado (se necesita node >= 18)"
NODE_MAJOR=$(node -p 'process.versions.node.split(".")[0]')
[[ "$NODE_MAJOR" -ge 18 ]] || fail "node >= 18 requerido (tienes $(node -v))"
[[ -f .env ]] || fail "No existe .env. Copia .env.example a .env y rellena las credenciales FTP."
[[ -d node_modules ]] || { log "Instalando dependencias"; npm install --no-audit --no-fund; }

# ----------------------------- build -----------------------------------------
if [[ $DO_BUILD -eq 1 ]]; then
  log "Generando dist/"
  npm run --silent build
fi
[[ -f dist/index.html ]] || fail "dist/index.html no existe. Ejecuta npm run build."

# ----------------------------- subida por FTP --------------------------------
node lib/ftp-deploy.js ${NODE_ARGS[@]+"${NODE_ARGS[@]}"}

SITE_URL=$(node -p 'JSON.parse(require("fs").readFileSync("site.config.json","utf8")).baseUrl')
[[ " ${NODE_ARGS[*]-} " == *" --dry-run "* ]] || ok "Publicado → $SITE_URL/"
