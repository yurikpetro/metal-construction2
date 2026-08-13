#!/usr/bin/env bash
# Ежедневный бэкап БД: pg_dump из контейнера postgres + ротация старых копий.
# Пример cron (каждый день в 3:00): 0 3 * * * /path/to/scripts/backup-db.sh >> /var/log/mc-backup.log 2>&1
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_DIR="$PROJECT_DIR/backups"
KEEP_DAYS=14

cd "$PROJECT_DIR"
set -a
source .env
set +a

mkdir -p "$BACKUP_DIR"

STAMP=$(date +%Y-%m-%d_%H-%M-%S)
FILE="$BACKUP_DIR/backup_${STAMP}.sql.gz"

docker compose exec -T postgres pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" | gzip > "$FILE"

find "$BACKUP_DIR" -name 'backup_*.sql.gz' -mtime "+${KEEP_DAYS}" -delete

echo "Бэкап сохранён: $FILE"
