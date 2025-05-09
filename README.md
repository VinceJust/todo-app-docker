# Full-Stack Todo App (React + Node.js + Docker Compose)

Dies ist eine containerisierte Full-Stack-Anwendung bestehend aus einem React-Frontend, einer Express-basierten Node.js-API und einer PostgreSQL-Datenbank. Die Anwendung ermöglicht das Erstellen, Anzeigen und Löschen von To-do-Einträgen über eine REST-Schnittstelle. Die gesamte App wird über Docker Compose orchestriert.

## Projektstruktur

```
react-app-HA/
├── backend/                # Node.js Express API
│   ├── .dockerignore
│   ├── data/
│   ├── .gitignore
│   ├── Dockerfile
│   ├── index.js
│   ├── package-lock.json
│   └── package.json
│
├── frontend/              # React App (Vite + Nginx)
│   ├── .dockerignore
│   ├── .gitignore
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── vite.config.js
│   ├── public/
│   └── src/
│       └── components/
│           ├── TodoFilter.jsx
│           ├── TodoForm.jsx
│           └── TodoList.jsx
│
├── docker-compose.yml     # Orchestriert alle drei Services
├── .gitignore
├── README.md
└── sql-recap.md
```

## Features

* React-Frontend mit Vite
* Express-API mit vollständiger CRUD-Funktionalität
* PostgreSQL-Datenbank zur Datenpersistenz
* ENV-Logging mit Winston (ohne Klartextpasswort)
* Reverse Proxy mit Nginx für API-Aufrufe über `/api`
* HEALTHCHECK im Frontend-Container
* Vollständige Orchestrierung mit Docker Compose
* Persistente Volumes für Datenbank und Backend-Daten

## Voraussetzungen

* Docker
* Node.js (optional für lokale Tests)
* psql (optional für DB-Tests)

## Anwendung starten mit Docker Compose

```bash
docker-compose up --build -d
```

Aufrufen im Browser: http://localhost:8080

## Datenbank

Die PostgreSQL-Datenbank wird beim ersten Start mit folgenden Werten initialisiert:

* DB-Name: `tododb`
* User: `todo_user`
* Passwort: `supersecure`

Diese Werte werden als Umgebungsvariablen in `docker-compose.yml` definiert und an das Backend weitergegeben. Das Backend loggt diese mit Winston beim Start (Passwort wird nicht im Klartext geloggt).

## Logging mit Winston

Das Backend verwendet Winston, um strukturierte Logs auszugeben. Beim Start werden u.a. folgende Infos geloggt:

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

## Datenpersistenz testen

```bash
# Stoppen & Starten
docker-compose stop
docker-compose start

# Optional: PostgreSQL testen
docker-compose exec database psql -U todo_user -d tododb
```