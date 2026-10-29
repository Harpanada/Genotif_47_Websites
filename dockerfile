# FROM node:26-alpine AS base


# # 1. Install dependencies
# FROM base AS deps
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci

# # 2. Rebuild source code
# FROM base AS builder
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .
# ENV NEXT_TELEMETRY_DISABLED 1

# # Generate contract Prisma 8 sebelum Next.js di-build
# RUN npx prisma contract emit

# RUN npm run build

# # 3. Production image
# FROM base AS runner
# WORKDIR /app

# ENV NODE_ENV production
# ENV NEXT_TELEMETRY_DISABLED 1

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

# COPY --from=builder /app/public ./public
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# USER nextjs

# EXPOSE 3000
# ENV PORT 3000
# ENV HOSTNAME "0.0.0.0"

# CMD ["node", "server.js"]


FROM node:26-alpine AS base

# 1. Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 2. Build aplikasi Next.js
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

# Client key harus tersedia saat next build
ARG NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
ENV NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=${NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}

RUN test -n "$NEXT_PUBLIC_MIDTRANS_CLIENT_KEY" \
    || (echo "Client key tidak tersedia saat build" && exit 1)

RUN npx prisma contract emit
RUN npm run build

RUN test -f /app/.next/standalone/node_modules/playwright-core/browsers.json \
    || (echo "ERROR: playwright-core/browsers.json tidak masuk standalone" && exit 1)

# 3. Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
