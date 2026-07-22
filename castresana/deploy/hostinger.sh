#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════
# Castresana OS — instalador/actualizador para el VPS de Hostinger
# (srv1518906 · 82.29.170.102). Idempotente: ejecutar de nuevo = actualizar.
#
# Qué hace:
#   1. Instala Node.js 22 y PM2 si faltan (no toca nada existente)
#   2. Clona/actualiza el repo público en /opt/castresana-os
#   3. Compila la app y la deja corriendo con PM2 en el puerto 3010
#   4. Abre el puerto en UFW si el firewall está activo
#   5. Configura arranque automático tras reinicios del VPS
#
# NO toca: OpenClaw (puerto 40846), nginx, ni ningún otro servicio.
# ═══════════════════════════════════════════════════════════════════
set -euo pipefail

REPO="https://github.com/jpau2569/urban-oviedo-links.git"
BRANCH="claude/inmobiliaria-app-improvements-dsm8dy"
DIR="/opt/castresana-os"
APP="castresana-os"
PORT=3010

log() { printf "\n\033[1;33m▸ %s\033[0m\n" "$*"; }

[ "$(id -u)" -eq 0 ] || { echo "Ejecutar como root (eres $(whoami))"; exit 1; }

log "1/6 · Comprobando Node.js ≥ 20…"
if ! command -v node >/dev/null 2>&1 || [ "$(node -e 'console.log(parseInt(process.versions.node))')" -lt 20 ]; then
  log "Instalando Node.js 22 (NodeSource)…"
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi
node --version

log "2/6 · Comprobando PM2…"
command -v pm2 >/dev/null 2>&1 || npm install -g pm2
pm2 --version

log "3/6 · Código: clonar o actualizar rama ${BRANCH}…"
if [ -d "$DIR/.git" ]; then
  git -C "$DIR" fetch origin "$BRANCH"
  git -C "$DIR" checkout -B "$BRANCH" "origin/$BRANCH"
else
  git clone --branch "$BRANCH" --single-branch "$REPO" "$DIR"
fi
git -C "$DIR" log --oneline -1

log "4/6 · Dependencias y build de producción…"
cd "$DIR/castresana"
npm ci --no-audit --no-fund
npm run build

log "5/6 · Arrancando con PM2 en el puerto ${PORT}…"
pm2 delete "$APP" >/dev/null 2>&1 || true
pm2 start npm --name "$APP" --cwd "$DIR/castresana" -- start -- -p "$PORT" -H 0.0.0.0
pm2 save
pm2 startup systemd -u root --hp /root >/dev/null 2>&1 || true

log "6/6 · Firewall…"
if command -v ufw >/dev/null 2>&1 && ufw status | grep -q "Status: active"; then
  ufw allow "$PORT"/tcp >/dev/null && echo "Puerto ${PORT} abierto en UFW"
else
  echo "UFW inactivo o no instalado — nada que abrir"
fi

sleep 3
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:${PORT}/" || true)
echo
if [ "$STATUS" = "200" ]; then
  printf "\033[1;32m✔ Castresana OS desplegado y respondiendo (HTTP %s)\033[0m\n" "$STATUS"
else
  printf "\033[1;31m✘ La app no responde aún (HTTP %s). Revisa: pm2 logs %s\033[0m\n" "$STATUS" "$APP"
  exit 1
fi

IP=$(hostname -I | awk '{print $1}')
cat <<EOF

  ═══════════════════════════════════════════════════
   Castresana OS — enlaces de uso
  ═══════════════════════════════════════════════════
   OS completo ......... http://${IP}:${PORT}/
   Suite un-archivo .... http://${IP}:${PORT}/suite.html
   Portal cliente ...... http://${IP}:${PORT}/client-portal/demo-cliente
   Portal propietario .. http://${IP}:${PORT}/owner-portal/demo-propietario
   Media Studio ........ http://${IP}:${PORT}/media-studio
   Equipo de agentes ... http://${IP}:${PORT}/agents

   Actualizar en el futuro: vuelve a ejecutar este script.
   Logs: pm2 logs ${APP} · Estado: pm2 status
   Para HTTPS + instalación PWA: ver deploy/README.md
  ═══════════════════════════════════════════════════
EOF
