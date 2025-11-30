FROM node:20

# 1) pnpm telepítése
RUN npm install -g pnpm

# 2) Munka könyvtár
WORKDIR /app

# 3) Monorepo fájlok bemásolása
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml turbo.json ./
COPY apps ./apps
COPY packages ./packages

# 4) Függőségek telepítése (teljes monorepo)
RUN pnpm install

# 5) Prisma client generálása
WORKDIR /app/apps/api
RUN pnpm exec prisma generate

# 6) Alap parancs – ezt a docker-compose felülírja egy hosszabb command-dal
CMD ["pnpm", "run", "start:dev"]