# To-Do App mit React + Vite + Docker

## Features
- Aufgaben hinzufügen, löschen, filtern
- Zustand mit React Hooks
- Produktionsbereit durch Vite + Nginx

## Build & Start

```bash
npm install
npm run build
docker build -t todo-react-app .
docker run -d -p 8080:80 todo-react-app
```

---

## Reflexion

**Was wird im Image gespeichert?**  
Der gebaute Inhalt aus dem /dist Ordner, nicht der Quellcode. Das sorgt für kleinere Images und höhere Sicherheit.

**Welche Rolle spielt Nginx?**  
Nginx wird als Webserver genutzt, um die statischen Dateien (HTML, CSS, JS) auszuliefern.

**Warum wird der Entwicklungsmodus (`npm run dev`) nicht für die Produktion verwendet?**  
Der Dev-Server ist nur für lokale Entwicklung gedacht: er ist nicht optimiert, langsamer und bietet keine Sicherheitsmechanismen wie ein echter Webserver.

**Was ist der Vorteil eines Containers gegenüber einem lokalen Build?**  
Ein Container garantiert eine konsistente Laufzeitumgebung, unabhängig vom Hostsystem.  
Er erleichtert Deployments, Automatisierung (CI/CD) und Teamarbeit, da überall die gleiche Umgebung genutzt wird.
