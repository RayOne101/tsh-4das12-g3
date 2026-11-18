#!/usr/bin/env bash
# Demarre la pile locale TSH : conteneurs (Postgres, Keycloak, MinIO, pgweb),
# puis Eureka, le microservice User et la Gateway.
#
#   ./start-local.sh            # utilise les jars deja construits
#   ./start-local.sh --build    # reconstruit les jars avant de demarrer
#
# Maven : `mvn` doit etre dans le PATH, sinon passer MVN=/chemin/vers/mvn.
set -euo pipefail

cd "$(dirname "$0")"

MVN="${MVN:-mvn}"
LOG_DIR="$PWD/logs"
PID_DIR="$LOG_DIR/pids"
BUILD=0

for arg in "$@"; do
  case "$arg" in
    --build) BUILD=1 ;;
    -h|--help) sed -n '2,10p' "$0"; exit 0 ;;
    *) echo "Argument inconnu : $arg" >&2; exit 1 ;;
  esac
done

mkdir -p "$LOG_DIR" "$PID_DIR"

port_open() {
  curl -s -o /dev/null "http://localhost:$1" 2>/dev/null
}

wait_for() {
  local label="$1" port="$2" seconds="$3" i=0
  while [ "$i" -lt "$seconds" ]; do
    if port_open "$port"; then
      echo "  $label pret (port $port)"
      return 0
    fi
    i=$((i + 2))
    sleep 2
  done
  echo "  $label ne repond pas sur le port $port (voir $LOG_DIR/)" >&2
  return 1
}

start_service() {
  local name="$1" port="$2" jar="$3"
  if port_open "$port"; then
    echo "  $name deja en cours sur le port $port, ignore"
    return 0
  fi
  [ -f "$jar" ] || { echo "  Jar manquant : $jar (relancer avec --build)" >&2; return 1; }
  nohup java -jar "$jar" > "$LOG_DIR/$name.log" 2>&1 &
  echo $! > "$PID_DIR/$name.pid"
  wait_for "$name" "$port" 90
}

echo "1/3 Conteneurs (Postgres, pgweb, Keycloak, MinIO)"
docker compose -f microservices/User/docker-compose.yml up -d
echo "  attente de Keycloak..."
wait_for Keycloak 8085 120 > /dev/null
echo "  attente de MinIO..."
wait_for MinIO 9000 60 > /dev/null
echo "  infrastructure prete"

if [ "$BUILD" = "1" ]; then
  echo "2/3 Build Maven"
  "$MVN" -B -q -DskipTests -f pom.xml \
    -pl infrastructure/Eureka,infrastructure/Gateway,microservices/User package
else
  echo "2/3 Build ignore (--build pour reconstruire)"
fi

echo "3/3 Services Spring"
start_service eureka 8761 infrastructure/Eureka/target/eureka-server-0.0.1-SNAPSHOT.jar
start_service user 8762 microservices/User/target/User-0.0.1-SNAPSHOT.jar
start_service gateway 8083 infrastructure/Gateway/target/gateway-0.0.1-SNAPSHOT.jar

cat <<EOF

Pile locale demarree.
  Eureka    http://localhost:8761
  User      http://localhost:8762/api/utilisateurs/me  (401 sans jeton)
  Gateway   http://localhost:8083/api
  Keycloak  http://localhost:8085  (admin / admin123)
  MinIO     http://localhost:9001  (minioadmin / minioadmin)
  Frontend  cd ../Frontend && npm run dev -> http://localhost:5173

Logs : $LOG_DIR/<service>.log
Arret : ./stop-local.sh  (ajouter --infra pour couper aussi les conteneurs)
EOF
