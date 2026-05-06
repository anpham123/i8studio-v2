#!/bin/bash
# Deploy script for demo.i8studio.vn — run on VPS 103.7.41.110
# Usage: bash deploy.sh [--no-cache]
set -e

NO_CACHE=""
if [ "$1" = "--no-cache" ]; then
    NO_CACHE="--no-cache"
fi

echo "==> Pulling latest code..."
git pull origin master

echo "==> Building app image..."
docker-compose build $NO_CACHE app

echo "==> Restarting services..."
docker-compose up -d

echo "==> Removing dangling images..."
docker image prune -f

echo "==> Container status:"
docker-compose ps

echo ""
echo "Deployed! https://demo.i8studio.vn"
