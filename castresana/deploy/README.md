# Despliegue en el VPS de Hostinger

## Instalar / actualizar (un solo comando)

Entra en **hPanel → VPS → srv1518906 → Terminal del navegador** (o `ssh root@82.29.170.102`) y pega:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/jpau2569/urban-oviedo-links/claude/inmobiliaria-app-improvements-dsm8dy/castresana/deploy/hostinger.sh)
```

Al terminar imprime los enlaces de uso. La app queda en PM2 (`castresana-os`, puerto **3010**) con arranque automático tras reinicios. **No toca OpenClaw** (puerto 40846) ni nginx.

- Actualizar tras nuevos cambios: ejecutar el mismo comando otra vez.
- Logs: `pm2 logs castresana-os` · Estado: `pm2 status` · Parar: `pm2 stop castresana-os`

## HTTPS + dominio (para instalarla como PWA)

El service worker y la instalación como app requieren HTTPS. Con un dominio (p. ej. `os.asesoriacastresana.com` apuntando con un registro A a `82.29.170.102`):

```bash
apt-get install -y nginx certbot python3-certbot-nginx
cat >/etc/nginx/sites-available/castresana-os <<'CONF'
server {
    listen 80;
    server_name os.asesoriacastresana.com;
    location / {
        proxy_pass http://127.0.0.1:3010;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
CONF
ln -sf /etc/nginx/sites-available/castresana-os /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
certbot --nginx -d os.asesoriacastresana.com --redirect -m hola@asesoriacastresana.com --agree-tos -n
```

Resultado: `https://os.asesoriacastresana.com` con certificado renovándose solo — y desde el móvil, «Añadir a pantalla de inicio» instala Castresana OS con su icono.
