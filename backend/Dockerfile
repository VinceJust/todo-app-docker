# Basis-Image
FROM node:lts-alpine

# Arbeitsverzeichnis im Container
WORKDIR /app

# package.json und lockfile kopieren
COPY package*.json ./

# Nur Produktionsabhängigkeiten installieren
RUN npm install --production

# Restlichen Code kopieren
COPY . .

# Port setzen
EXPOSE 3000

# Startkommando
CMD ["npm", "start"]
