#!/usr/bin/env bash
# Ежедневный бэкап SQLite-базы: консистентный снимок через `.backup` (безопасно
# даже пока приложение работает и пишет в базу) + ротация старых копий.
# Пример cron (каждый день в 3:00): 0 3 * * * /path/to/scripts/backup-db.sh >> /var/log/mc-backup.log 2>&1
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKUP_DIR="$PROJECT_DIR/backups"
KEEP_DAYS=14

cd "$PROJECT_DIR"

mkdir -p "$BACKUP_DIR"

STAMP=$(date +%Y-%m-%d_%H-%M-%S)
TMP_NAME="backup-${STAMP}.db"
FILE="$BACKUP_DIR/backup_${STAMP}.db.gz"

docker compose exec -T app sqlite3 /app/data/prod.db ".backup /app/data/${TMP_NAME}"
docker compose cp "app:/app/data/${TMP_NAME}" "$BACKUP_DIR/${TMP_NAME}"
docker compose exec -T app rm "/app/data/${TMP_NAME}"

gzip "$BACKUP_DIR/${TMP_NAME}"
mv "$BACKUP_DIR/${TMP_NAME}.gz" "$FILE"

find "$BACKUP_DIR" -name 'backup_*.db.gz' -mtime "+${KEEP_DAYS}" -delete

echo "Бэкап сохранён: $FILE"
