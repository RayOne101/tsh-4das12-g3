#!/usr/bin/env bash
# Arrete les services demarres par ./start-local.sh.
#   ./stop-local.sh           # seulement Eureka, User et Gateway
#   ./stop-local.sh --infra   # + les conteneurs Docker
set -euo pipefail

cd "$(dirname "$0")"

PID_DIR="$PWD/logs/pids"
STOP_INFRA=0
[ "${1:-}" = "--infra" ] && STOP_INFRA=1

stop_pid() {
  local file="$1" pid
  [ -f "$file" ] || return 0
  pid="$(cat "$file")"
  if kill "$pid" 2>/dev/null; then
    echo "  $(basename "$file" .pid) arrete (pid $pid)"
  else
    echo "  $(basename "$file" .pid) deja arrete"
  fi
  rm -f "$file"
}

echo "Services Spring"
for name in gateway user eureka; do
  stop_pid "$PID_DIR/$name.pid"
done

if [ "$STOP_INFRA" = "1" ]; then
  echo "Conteneurs"
  docker compose -f microservices/User/docker-compose.yml down
fi
