# Full-Stack Todo App (React + Node.js + Docker Compose)

Dies ist eine containerisierte Full-Stack-Anwendung bestehend aus einem React-Frontend, einer Express-basierten Node.js-API und einer PostgreSQL-Datenbank. Die Anwendung erlaubt das Erstellen, Anzeigen und Löschen von To-do-Einträgen über eine REST-Schnittstelle. Die gesamte App wird über Docker Compose orchestriert.

## Projektstruktur

```
react-app-HA/
├── backend/                # Node.js Express API
│   ├── src/               # Service, DB-Modul, Routing
│   ├── sql/               # initial_schema.sql
│   ├── Dockerfile
│   └── package.json
├── frontend/               # React App (Vite + Nginx)
│   └── Dockerfile
├── docker-compose.yml     # Orchestriert alle drei Services
└── README.md
```

## Features

* React-Frontend mit Vite
* Express-API mit PostgreSQL-Datenbankanbindung
* Manuelles Datenbank-Schema via SQL-Datei
* Persistente Volumes für die Datenbank
* ENV-basierte DB-Konfiguration
* Parametrisierte SQL-Abfragen (SQL Injection Schutz)
* Modularer Service Layer im Backend
* Fehlerbehandlung und Logging via Winston
* Reverse Proxy via Nginx

## Voraussetzungen

* Docker (empfohlen: Docker Desktop)
* Optional: `psql` CLI-Tool zur manuellen DB-Prüfung

## Anwendung starten

```bash
docker-compose up --build -d
```

Frontend erreichbar unter: [http://localhost:8080](http://localhost:8080)

## Manuelles Schema-Management

Die Datei `backend/sql/initial_schema.sql` definiert die `todos`-Tabelle und wird beim ersten Start durch den Einhängepunkt `/docker-entrypoint-initdb.d` ausgeführt.

Beispiel:

```sql
CREATE TABLE IF NOT EXISTS todos (
  id SERIAL PRIMARY KEY,
  text VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Persistenz testen (ohne Datenverlust)

```bash
docker-compose stop
docker-compose start
```

Danach erneut im Browser laden oder in die Datenbank schauen:

```bash
docker exec -it react-app-ha-database-1 bash
psql -U todo_user -d tododb
SELECT * FROM todos;
```

## Sicherheitsmaßnahmen

* Alle SQL-Queries verwenden Platzhalter mit Werten:

  ```js
  pool.query('SELECT * FROM todos WHERE id = $1', [id]);
  ```
* Keine String-Konkatenation bei Abfragen
* ENV-Logging ohne Klartextpasswort

## Logging

Backend loggt u.a.:

```json
info: Starting backend API...
info: Database Configuration (from ENV): {
  "DB_HOST": "database",
  "DB_PORT": "5432",
  "DB_USER": "todo_user",
  "DB_NAME": "tododb",
  "DB_PASSWORD": "[REDACTED]"
}
```