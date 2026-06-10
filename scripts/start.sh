#!/bin/sh
set -e

echo "==> Running Prisma DB Push..."
prisma db push --accept-data-loss

echo "==> Starting Next.js server..."
exec node server.js
