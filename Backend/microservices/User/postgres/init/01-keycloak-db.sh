#!/bin/sh
set -euo pipefail

# Cree une base PostgreSQL dediee a Keycloak sur le meme serveur que User.
# Ce script ne s'execute qu'a l'initialisation d'un volume PostgreSQL vide.

kc_db="keycloak"
kc_user="${KEYCLOAK_DB_USER:-keycloak}"
kc_password="${KEYCLOAK_DB_PASSWORD:-keycloak}"

psql -v ON_ERROR_STOP=1 \
  --username "$POSTGRES_USER" \
  --dbname "$POSTGRES_DB" \
  --set=kc_db="$kc_db" \
  --set=kc_user="$kc_user" \
  --set=kc_password="$kc_password" <<'EOSQL'
SELECT format('CREATE ROLE %I LOGIN PASSWORD %L', :'kc_user', :'kc_password')
WHERE NOT EXISTS (SELECT FROM pg_roles WHERE rolname = :'kc_user')
\gexec

SELECT format('CREATE DATABASE %I OWNER %I', :'kc_db', :'kc_user')
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = :'kc_db')
\gexec
EOSQL
