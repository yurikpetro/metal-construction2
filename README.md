# Кровельные ограждения — сайт

Сайт-каталог с корзиной, оформлением заявок и админкой (мини-CRM по заявкам, управление товарами, статистика) для продажи кровельных металлоограждений и сопутствующих товаров.

## Стек

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui
- PostgreSQL + Prisma 7 (драйвер-адаптер `@prisma/adapter-pg`)
- Zustand — корзина (хранится в localStorage)
- iron-session + bcrypt — авторизация админки
- Telegram Bot API + Resend — уведомления о заявках
- Docker Compose + Caddy — деплой на VPS

## Локальная разработка

1. Установите зависимости:
   ```bash
   npm install
   ```
2. Скопируйте `.env.example` в `.env` (уже сделано в репозитории для локальной разработки — значения по умолчанию рассчитаны на локальный Postgres из `docker-compose.dev.yml`).
3. Поднимите локальный Postgres:
   ```bash
   docker compose -f docker-compose.dev.yml up -d
   ```
4. Примените миграции, сгенерируйте клиент и засейте демо-данные:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   npx prisma db seed
   ```
5. Запустите дев-сервер:
   ```bash
   npm run dev
   ```

Логин в админку по умолчанию: `admin` / `changeme123` (задаётся через `ADMIN_SEED_USERNAME`/`ADMIN_SEED_PASSWORD` в `.env`, сменить пароль можно и в самой админке после входа).

## Переменные окружения

См. `.env.example` (локально) и `.env.production.example` (для сервера) — там же комментарии, что откуда берётся: Telegram-токен и chat id от @BotFather, API-ключ Resend с resend.com и т.д.

## Деплой на VPS

1. Установите Docker и Docker Compose на сервере.
2. Склонируйте репозиторий, скопируйте `.env.production.example` → `.env` и заполните реальными значениями (пароль БД, домен, секреты, токены).
3. Убедитесь, что DNS-запись домена указывает на IP сервера (нужно для авто-HTTPS через Caddy).
4. Запустите:
   ```bash
   docker compose up -d --build
   ```
   Сервис `migrate` автоматически применит миграции перед стартом `app`.
5. Для обновления после изменений в коде:
   ```bash
   git pull
   docker compose up -d --build
   ```

Бэкапы БД — см. `scripts/backup-db.sh` (ежедневный `pg_dump` по cron с ротацией).
