# Full-Stack Todo App (React + Node.js + Docker)

Dies ist eine containerisierte Full-Stack-Anwendung bestehend aus einem React-Frontend und einer Express-basierten Node.js-API. Die Anwendung ermöglicht das Erstellen, Anzeigen und Löschen von To-do-Einträgen über eine REST-Schnittstelle.

---

## 📁 Projektstruktur

react-app-HA/
├── backend/ # Node.js Express API
│ ├── Dockerfile
│ ├── index.js
│ └── package.json
├── frontend/ # React App (Vite)
│ ├── Dockerfile
│ ├── src/
│ └── package.json
├── .gitignore
├── .dockerignore
└── README.md


---

## Features

- React-Frontend mit Vite
- Express-API mit CRUD-Funktionalität für To-dos
- Daten werden im Arbeitsspeicher gehalten
- Frontend kommuniziert über `fetch` mit der API
- Containerisiert mit Docker (zwei separate Container)
- Konfigurierbar über Umgebungsvariablen und Build-Argumente
- HEALTHCHECK im Nginx-Container

---

## Voraussetzungen

- [Docker](https://www.docker.com/)
- [Node.js](https://nodejs.org/) (optional, für lokale Tests)

---

## Anwendung bauen & starten

### 1. Backend bauen & starten

```bash
cd backend
docker build -t my-backend-api .
docker run -d -p 8081:3000 --name my-backend my-backend-api
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