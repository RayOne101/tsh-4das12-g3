-- Script d'initialisation automatique des 8 bases de donnees PostgreSQL pour TSH
-- Règle d'architecture : Database-per-Service (isolation stricte)

CREATE DATABASE tsh_users;
CREATE DATABASE tsh_logements;
CREATE DATABASE tsh_coloc;
CREATE DATABASE tsh_contrats;
CREATE DATABASE tsh_communication;
CREATE DATABASE tsh_avis;
CREATE DATABASE tsh_furniture;
CREATE DATABASE tsh_moving;

GRANT ALL PRIVILEGES ON DATABASE tsh_users TO tsh_admin;
GRANT ALL PRIVILEGES ON DATABASE tsh_logements TO tsh_admin;
GRANT ALL PRIVILEGES ON DATABASE tsh_coloc TO tsh_admin;
GRANT ALL PRIVILEGES ON DATABASE tsh_contrats TO tsh_admin;
GRANT ALL PRIVILEGES ON DATABASE tsh_communication TO tsh_admin;
GRANT ALL PRIVILEGES ON DATABASE tsh_avis TO tsh_admin;
GRANT ALL PRIVILEGES ON DATABASE tsh_furniture TO tsh_admin;
GRANT ALL PRIVILEGES ON DATABASE tsh_moving TO tsh_admin;
