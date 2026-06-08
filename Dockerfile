FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat openssl

# ---- Install dependencies ----
FROM base AS installer
WORKDIR /app

# Copy package manifests first for layer caching
COPY package.json package-lock.json turbo.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY packages/database/package.json ./packages/database/package.json
COPY packages/types/package.json ./packages/types/package.json
COPY packages/validation/package.json ./packages/validation/package.json
COPY packages/config/package.json ./packages/config/package.json

RUN npm install

# Copy full source
COPY apps/api ./apps/api
COPY packages ./packages

# Generate Prisma client (DATABASE_URL not needed at generate time)
RUN cd packages/database && npx prisma generate

# Build API
RUN npm run build -w @project-pilot/api

# ---- Runtime image ----
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 expressjs

COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/api/dist ./dist
COPY --from=installer /app/apps/api/package.json ./package.json
COPY --from=installer /app/packages/database/prisma ./prisma

USER expressjs

EXPOSE 4000
CMD ["node", "dist/index.js"]
