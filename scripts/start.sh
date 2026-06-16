#!/bin/sh
set -e

echo "==> Running Prisma DB Push..."
prisma db push --skip-generate

if [ -f "./prisma/seed-blog.js" ]; then
  echo "==> Seeding blog data..."
  node ./prisma/seed-blog.js
fi

echo "==> Starting Next.js server..."
exec node server.js
