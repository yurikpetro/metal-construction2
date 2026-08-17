FROM node:22-slim AS base
WORKDIR /app
# sqlite3 — CLI для .backup (см. scripts/backup-db.sh), openssl — нужен Prisma
RUN apt-get update && apt-get install -y --no-install-recommends openssl sqlite3 && rm -rf /var/lib/apt/lists/*
# /app/data — том для файла SQLite (и в migrator, и в runner); создаём здесь,
# чтобы каталог точно существовал до первого открытия базы
RUN mkdir -p /app/data

FROM base AS deps
# better-sqlite3 не поставляет готовый бинарник для этой версии Node и собирается
# из исходников через node-gyp, которому нужны Python и компилятор C++.
# Ставим их только здесь: в рантайм-образ (стадия runner) они не попадают,
# туда копируется уже скомпилированный .node-аддон.
RUN apt-get update && apt-get install -y --no-install-recommends build-essential python3 && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Переменные с префиксом NEXT_PUBLIC_ Next.js подставляет в код на этапе сборки,
# а не читает в рантайме, поэтому их нужно передать build-аргументами — иначе
# счётчик Яндекс.Метрики не подключится, а canonical/sitemap уедут на localhost.
# Значения приходят из .env через docker-compose.yml.
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_YANDEX_METRIKA_ID
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_YANDEX_METRIKA_ID=$NEXT_PUBLIC_YANDEX_METRIKA_ID

RUN npx prisma generate
RUN npm run build

# Полный образ (со всеми node_modules и Prisma CLI) — используется только
# для применения миграций перед стартом приложения, см. сервис "migrate" в docker-compose.yml
FROM builder AS migrator
CMD ["npx", "prisma", "migrate", "deploy"]

# Минимальный рантайм-образ — только standalone-сборка Next.js
FROM base AS runner
ENV NODE_ENV=production
RUN groupadd --system --gid 1001 nodejs && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/src/generated/prisma ./src/generated/prisma
# better-sqlite3 — нативный аддон с прекомпилированным .node-бинарником внутри
# пакета; копируем его явно, а не полагаемся на автотрейсинг standalone-сборки
# (для нативных биндингов он ненадёжен)
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/better-sqlite3 ./node_modules/better-sqlite3

RUN mkdir -p /app/public/uploads /app/data && chown nextjs:nodejs /app/public/uploads /app/data

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
