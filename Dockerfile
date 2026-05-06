# ============================================================
# Stage 1: Install dependencies + generate Prisma client
# ============================================================
FROM node:20-alpine AS deps
WORKDIR /app

RUN apk add --no-cache libc6-compat openssl

COPY package*.json ./
COPY prisma/schema.prisma ./prisma/schema.prisma

RUN npm ci
RUN npx prisma generate

# ============================================================
# Stage 2: Build Next.js application
# ============================================================
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache libc6-compat openssl

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate

ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_SITE_URL=https://demo.i8studio.vn

RUN npm run build

# ============================================================
# Stage 3: Production runner (minimal image)
# ============================================================
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache libc6-compat openssl

# Install Prisma CLI for running migrations at startup
RUN npm install -g prisma@5.22.0

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Next.js standalone server
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Prisma schema + migrations
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

# Prisma generated client (needed by the app at runtime)
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# Persistent data directories
RUN mkdir -p /app/prisma/data /app/public/uploads/pdfs && \
    chown -R nextjs:nodejs /app/prisma/data /app/public/uploads

COPY --chown=nextjs:nodejs scripts/start.sh ./scripts/start.sh
RUN chmod +x ./scripts/start.sh

USER nextjs
EXPOSE 3000

CMD ["sh", "./scripts/start.sh"]
