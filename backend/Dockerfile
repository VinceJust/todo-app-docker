# Basis-Image
FROM node:lts-alpine

# Arbeitsverzeichnis im Container
WORKDIR /app

# package.json UND package-lock.json kopieren
COPY package*.json ./

# Deterministische Installation (setzt Lockfile voraus)
RUN npm ci --omit=dev

# Restlichen Code kopieren
COPY . .

# Port freigeben
EXPOSE 3000

# Startkommando
CMD ["npm", "start"]
