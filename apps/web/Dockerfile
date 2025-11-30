FROM node:20

RUN npm install -g pnpm

WORKDIR /app

COPY pnpm-lock.yaml package.json pnpm-workspace.yaml turbo.json ./
COPY apps ./apps
COPY packages ./packages

RUN pnpm install

WORKDIR /app/apps/web

CMD ["pnpm", "run", "dev"]