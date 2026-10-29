FROM node:22-alpine AS base
RUN npm install -g pnpm@12.8.1

WORKDIR /app
COPY pnpm-workspace.yaml package.json turbo.json tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/api-freelance/ ./apps/api-freelance/

RUN pnpm install --frozen-lockfile=false
RUN pnpm --filter @repo/db-core build
RUN pnpm --filter @repo/backend-core build
RUN pnpm --filter @repo/ai-sdk build
RUN pnpm --filter @repo/shared-dto build

WORKDIR /app/apps/api-freelance
RUN pnpm prisma generate
RUN pnpm build

EXPOSE 4003 4103
CMD ["node", "dist/main"]

