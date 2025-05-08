# Full-Stack Todo App (React + Node.js + Docker)

Dies ist eine containerisierte Full-Stack-Anwendung bestehend aus einem React-Frontend und einer Express-basierten Node.js-API. Die Anwendung ermöglicht das Erstellen, Anzeigen und Löschen von To-do-Einträgen über eine REST-Schnittstelle.

---

### SQL Recap

Theoretisches Datenbankschema inkl. CRUD und Reflexion siehe: [sql-recap.md](/sql-recap.md)

---

## Projektstruktur

```bash
react-app-HA/
├── backend/                 # Node.js Express API
│   ├── .dockerignore
│   ├── data/
│   ├── .gitignore
│   ├── Dockerfile
│   ├── index.js
│   ├── package-lock.json
│   └── package.json
│
├── frontend/                # React App (Vite)
│   ├── .dockerignore
│   ├── .gitignore
│   ├── Dockerfile
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── vite.config.js
│   ├── nginx.conf           # Reverse Proxy Konfiguration für Nginx
│   ├── .env.production
│   ├── public/
│   ├── dist/
│   ├── node_modules/
│   └── src/
│       ├── App.css
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── assets/
│       └── components/
│           ├── TodoFilter.jsx
│           ├── TodoForm.jsx
│           └── TodoList.jsx
│
├── .gitignore
├── README.md
└── sql-recap.md
```


---

## Features

- React-Frontend mit Vite
- Express-API mit vollständiger CRUD-Funktionalität
- Frontend kommuniziert via fetch mit dem Backend
- Datenpersistenz via JSON-Datei (/app/data/todos.json)
- Daten überstehen Container-Neustarts durch Docker Named Volume
- Dockerisierte Multi-Container-Architektur
- HEALTHCHECK im Nginx-Container
- Reverse Proxy mit Nginx für API-Aufrufe über /api
- Docker Bridge Netzwerk (my-app-network) für interne Kommunikation

---

## Voraussetzungen

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/) (optional, für lokale Tests)

---

## Anwendung bauen & starten

## Docker Netzwerk erstellen

```bash
docker network create my-app-network
```

### Backend mit Persistenz starten (Reverse Proxy Setup)

```bash
cd backend
docker build -t my-backend-api:network-proxy .
docker volume create my-backend-data

docker run -d --name backend-service \
  --network my-app-network \
  -p 8081:3000 \
  -v my-backend-data:/app/data \
  my-backend-api:network-proxy
```

Die API ist nun erreichbar unter:
http://localhost:8081/api/todos

### Frontend bauen & starten (mit Nginx Reverse Proxy)

```bash
cd frontend
docker build --build-arg VITE_API_URL=/api -t my-frontend-app:network-proxy .

docker run -d --name frontend-app \
  --network my-app-network \
  -p 8080:80 \
  my-frontend-app:network-proxy
```

Die React-App ist nun im Browser aufrufbar unter:
http://localhost:8080

---

### Volume-Typ: Entscheidung und Begründung
Für diese Aufgabe wurde ein Named Volume (my-backend-data) verwendet.

Vorteile:

- Daten bleiben erhalten, auch wenn der Container gelöscht wird
- Docker verwaltet Speicherort automatisch (sicher & robust)
- Ideal für Produktion oder strukturierte Entwicklungsumgebungen

Nachteil gegenüber Bind Mounts:

- Weniger Transparenz bei der Dateiansicht auf dem Hostsystem
- Für Debugging oder manuelles Editieren nicht so flexibel
- Für diese Anwendung war Stabilität und Trennung von Code & Daten wichtig, daher fiel die Entscheidung bewusst auf Named Volumes.


### Datenpersistenz testen
- Todo hinzufügen
- Container stoppen (docker stop my-backend-persistent)
- Container starten (docker start my-backend-persistent)
- Seite aktualisieren → Todos sind weiter vorhanden