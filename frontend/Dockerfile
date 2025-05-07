# Stage 1: Build the React app
FROM node:lts-alpine AS builder

WORKDIR /app

# Nimm das Build-Argument an und exportiere es als Umgebungsvariable
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


# Stage 2: Serve the app with Nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN echo "OK" > /usr/share/nginx/html/healthz.html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/healthz.html || exit 1
