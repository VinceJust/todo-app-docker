# Full-Stack Todo App (React + Node.js + Docker)

Dies ist eine containerisierte Full-Stack-Anwendung bestehend aus einem React-Frontend und einer Express-basierten Node.js-API. Die Anwendung ermöglicht das Erstellen, Anzeigen und Löschen von To-do-Einträgen über eine REST-Schnittstelle.

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
└── README.md
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

---

## Voraussetzungen

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/) (optional, für lokale Tests)

---

## Anwendung bauen & starten

### 1. Backend mit Persistenz starten

```bash
cd backend
docker build -t my-backend-api:persistence .
docker volume create my-backend-data
docker run -d -p 8081:3000 --name my-backend-persistent \
  -v my-backend-data:/app/data \
  my-backend-api:persistence
```

Die API ist nun erreichbar unter:
http://localhost:8081/api/todos

### 2. Frontend bauen & starten

```bash
cd frontend
docker build --build-arg VITE_API_URL=http://localhost:8081 -t my-frontend-app .
docker run -d -p 8080:80 --name my-frontend my-frontend-app
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