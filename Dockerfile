# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN apk add --no-cache libc6-compat

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3008
ARG NEXT_PUBLIC_BRAND_NAME="Mystic AI Studio"
ARG SOURCE_REPO_URL=
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_BRAND_NAME=$NEXT_PUBLIC_BRAND_NAME
ENV SOURCE_REPO_URL=$SOURCE_REPO_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3008
ENV HOSTNAME=0.0.0.0
ENV AI_BASE_URL=https://api.openai.com/v1
ENV AI_MODEL=gpt-4o-mini
ENV AI_TIMEOUT_MS=25000
ENV NEXT_PUBLIC_SITE_URL=http://localhost:3008
ENV NEXT_PUBLIC_BRAND_NAME="Mystic AI Studio"
ENV ALLOW_LOCAL_LEAD_LOG=false
ENV AUTH_DATA_DIR=/app/.data
ENV AUTH_COOKIE_SECURE=false

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs \
  && mkdir -p /app/.data \
  && chown nextjs:nodejs /app/.data

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3008

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 CMD node -e "fetch('http://127.0.0.1:3008/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
