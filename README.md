# Full-Stack Todo App (React + Node.js + Docker Swarm)

Dies ist eine containerisierte Full-Stack-Anwendung bestehend aus einem React-Frontend (Vite), einer Express-basierten Node.js-API und einer PostgreSQL-Datenbank. Die App wird erfolgreich auf einem verteilten **Docker Swarm Cluster mit Node Affinity** betrieben.

## Projektstruktur

```
react-app-HA/
├── backend/                # Node.js Express API
│   ├── src/               # Service, DB-Modul, Routing
│   ├── sql/               # initial_schema.sql
│   ├── Dockerfile
│   └── package.json
├── frontend/              # React App (Vite + Nginx)
│   ├── Dockerfile
│   └── nginx.conf
├── docker-stack.yml       # Swarm Stack Datei mit Platzierung & Healthchecks
└── README.md
```

## Features

* Frontend: React + Vite + Nginx Reverse Proxy
* Backend: Express + PostgreSQL (über Pool)
* Datenbank: Manuelles SQL-Schema mit `initial_schema.sql`
* CRUD: Vollständige REST-API mit GET, POST, PUT, DELETE
* Security: SQL-Injection-Schutz durch parametrisierte Queries
* Healthchecks: Für Frontend, Backend & DB im Swarm-Kontext
* Fehlerbehandlung & Logging mit Winston
* Node Affinity: gezielte Platzierung auf Swarm-Nodes

## Swarm Deployment (Multipass Setup)

* 4 VMs via Multipass: `manager`, `worker1`, `worker2`, `worker3`
* Swarm initiiert auf Manager: `docker swarm init`
* Nodes joined & gelabelt:

  * `worker1`: `role=worker1` (Frontend)
  * `worker2`: `role=worker2` (Backend)
  * `worker3`: `role=worker3` (DB)

## Images auf Docker Hub

Damit Worker-VMs Images ziehen können:

```bash
docker build -t vinjust/todo-backend:swarm ./backend
docker build -t vinjust/todo-frontend:swarm-fixed ./frontend
docker push vinjust/todo-backend:swarm
docker push vinjust/todo-frontend:swarm-fixed
```

## Stack-Deployment

```bash
scp docker-stack.yml ubuntu@manager:~/
ssh ubuntu@manager
# Auf Manager-VM:
docker stack deploy -c docker-stack.yml mystack
```

## Swarm Healthchecks & Placement

`docker-stack.yml` nutzt:

* Version 3.8
* `deploy.placement.constraints:` für gezielte Node-Zuweisung
* Healthchecks für alle Services
* Overlay-Netzwerk für Service-Kommunikation

## Nginx Proxy Konfiguration (frontend/nginx.conf)

```nginx
upstream backend {
  server backend:3000;
}

server {
  listen 80;

  location / {
    root /usr/share/nginx/html;
    index index.html;
    try_files $uri $uri/ /index.html;
  }

  location /api/ {
    proxy_pass http://backend;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header Connection "";
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```