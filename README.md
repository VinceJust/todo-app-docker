# Full-Stack Todo App (React + Node.js + Docker Compose)

Dies ist eine containerisierte Full-Stack-Anwendung bestehend aus einem React-Frontend, einer Express-basierten Node.js-API und einer PostgreSQL-Datenbank. Die Anwendung erlaubt das Erstellen, Anzeigen, Bearbeiten und Löschen von To-do-Einträgen über eine REST-Schnittstelle. Die gesamte App wird über Docker Compose orchestriert und erfüllt die Voraussetzungen für den produktionsnahen Einsatz, inklusive Healthchecks und Persistenz.

## Kubernetes Einführung – Lokales Cluster

Im Ordner [`kubernetes/`](kubernetes/) befindet sich die Abgabe zur Aufgabe **„Einführung in Kubernetes: Lokales Cluster aufsetzen & die Grundlagen überprüfen“**.

- Die schriftlichen Reflexionsantworten stehen in [`k8s-intro-reflection.md`](kubernetes/k8s-intro-reflection.md).
- Ein Screenshot (`k8s-cluster-proof.png`) zeigt, dass das lokale Kubernetes-Cluster erfolgreich läuft und `kubectl` korrekt verbunden ist.


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
* Alle vier CRUD-Operationen (Create, Read, Update, Delete)
* Manuelles Datenbank-Schema via SQL-Datei
* Persistente Volumes für die Datenbank
* ENV-basierte DB-Konfiguration
* Parametrisierte SQL-Abfragen (SQL Injection Schutz)
* Healthchecks für Backend und Datenbank
* Abhängigkeit auf gesunden DB-Zustand via `depends_on: condition: service_healthy`
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

## Healthchecks

### Backend:

Healthcheck-Endpunkt: `http://localhost:3000/health`

Ergänzt im Code:

```js
app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.status(200).send("OK");
  } catch (err) {
    res.status(503).send("DB nicht erreichbar");
  }
});
```

Healthcheck-Konfiguration in `docker-compose.yml`:

```yaml
healthcheck:
  test: ["CMD-SHELL", "curl -sf http://localhost:3000/health || exit 1"]
  interval: 5s
  timeout: 3s
  retries: 3
```

### PostgreSQL:

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U todo_user -d tododb"]
  interval: 5s
  timeout: 3s
  retries: 5
```

### Dependency im Backend-Service:

```yaml
depends_on:
  database:
    condition: service_healthy
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

## Healthcheck Status

```bash
docker-compose ps
```

Beispielausgabe:

```
NAME                      IMAGE                   STATUS               
react-app-ha-backend-1    react-app-ha-backend    Up (healthy)
react-app-ha-database-1   postgres:17-alpine      Up (healthy)
react-app-ha-frontend-1   react-app-ha-frontend   Up (healthy)
```

## CRUD-Benutzung im Browser

Alle vier CRUD-Operationen können über die UI im Browser durchgeführt werden. Neue Todos lassen sich erstellen, löschen, bearbeiten und als erledigt markieren. Die Daten werden in der PostgreSQL-Datenbank persistent gespeichert.

## Fehlerhandling & Stabilität

* Das Backend gibt bei ungültiger ID `400 Bad Request` zurück.
* Der Healthcheck meldet bei gestoppter Datenbank `503 Service Unavailable`.
* Das Frontend zeigt im Fehlerfall (z. B. keine Verbindung) eine benutzerfreundliche Fehlermeldung.
* Die Anwendung bleibt auch bei einem DB-Ausfall stabil und startet automatisch neu, sobald die DB wieder verfügbar ist.
