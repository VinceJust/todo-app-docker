# Basis-Image
FROM node:lts-alpine

# Tools wie curl installieren
RUN apk add --no-cache curl

# Arbeitsverzeichnis im Container
WORKDIR /app

# package.json und package-lock.json kopieren
COPY package*.json ./

# Abhängigkeiten installieren (nur Production)
RUN npm ci --omit=dev

# Restlichen Code kopieren
COPY src ./src
COPY sql ./sql

# Port freigeben
EXPOSE 3000

# Startkommando
CMD ["npm", "start"]
