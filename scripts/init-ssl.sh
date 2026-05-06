#!/bin/bash
# First-time SSL certificate setup for demo.i8studio.vn
# Run once on the VPS after initial docker-compose up
set -e

DOMAIN="demo.i8studio.vn"
EMAIL="info@i8studio.vn"
DATA_PATH="./data/certbot"

echo "==> Creating required directories..."
mkdir -p "$DATA_PATH/conf" "$DATA_PATH/www"

# Download recommended TLS parameters from Certbot
if [ ! -e "$DATA_PATH/conf/options-ssl-nginx.conf" ]; then
    echo "==> Downloading recommended TLS parameters..."
    curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf \
        > "$DATA_PATH/conf/options-ssl-nginx.conf"
fi

if [ ! -e "$DATA_PATH/conf/ssl-dhparams.pem" ]; then
    echo "==> Generating DH parameters (this takes a minute)..."
    openssl dhparam -out "$DATA_PATH/conf/ssl-dhparams.pem" 2048
fi

# Create a temporary self-signed cert so nginx can start before real cert exists
CERT_PATH="$DATA_PATH/conf/live/$DOMAIN"
if [ ! -e "$CERT_PATH/fullchain.pem" ]; then
    echo "==> Creating temporary self-signed certificate..."
    mkdir -p "$CERT_PATH"
    openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
        -keyout "$CERT_PATH/privkey.pem" \
        -out "$CERT_PATH/fullchain.pem" \
        -subj "/CN=$DOMAIN" 2>/dev/null
fi

echo "==> Starting nginx with temporary certificate..."
docker-compose up -d nginx

echo "==> Waiting for nginx to be ready..."
sleep 3

echo "==> Requesting Let's Encrypt certificate for $DOMAIN..."
docker-compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN"

echo "==> Reloading nginx with real SSL certificate..."
docker-compose exec nginx nginx -s reload

echo ""
echo "SSL certificate obtained successfully!"
echo "Site is live at: https://$DOMAIN"
