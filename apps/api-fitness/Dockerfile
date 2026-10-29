FROM node:22-alpine AS base
RUN npm install -g pnpm@12.8.1

WORKDIR /app
COPY pnpm-workspace.yaml package.json turbo.json tsconfig.base.json ./
COPY packages/ ./packages/
COPY apps/api-fitness/ ./apps/api-fitness/

RUN pnpm install --frozen-lockfile=false
RUN pnpm --filter @repo/db-core build
RUN pnpm --filter @repo/backend-core build
RUN pnpm --filter @repo/ai-sdk build
RUN pnpm --filter @repo/shared-dto build

WORKDIR /app/apps/api-fitness
RUN pnpm prisma generate
RUN pnpm build

EXPOSE 4002 4102
CMD ["node", "dist/main"]

