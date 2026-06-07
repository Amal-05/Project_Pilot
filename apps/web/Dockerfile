FROM node:18-alpine AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo
COPY . .
RUN turbo prune @project-pilot/web --docker

FROM base AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/package-lock.json ./package-lock.json
RUN npm install

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN npx turbo run build --filter=@project-pilot/web

FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/web/next.config.mjs ./
COPY --from=installer /app/apps/web/package.json ./
COPY --from=installer /app/apps/web/public ./public
COPY --from=installer --chown=nextjs:nodejs /app/apps/web/.next ./.next
COPY --from=installer /app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "start"]
