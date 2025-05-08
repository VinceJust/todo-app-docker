# SQL Schema und Abfragen – Full-Stack Todo App

## Tabellenentwurf

### Tabelle: `todos`

| Spaltenname | Datentyp     | Beschreibung                          |
|-------------|--------------|----------------------------------------|
| `id`        | INTEGER      | Primärschlüssel, eindeutig             |
| `text`      | VARCHAR(255) | Beschreibung des Todos, nicht null    |
| `completed` | BOOLEAN      | Ob das Todo erledigt ist              |
| `created_at`| TIMESTAMP    | Automatischer Zeitstempel der Erstellung |

```sql
CREATE TABLE todos (
  id INTEGER PRIMARY KEY,
  text VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## CRUD-SQL-Abfragen

### INSERT

```sql
INSERT INTO todos (text, completed) VALUES ('Learn Docker', false);
```

### SELECT

Alle Todos:

```sql
SELECT * FROM todos;
```

Ein bestimmtes Todo anhand seiner ID:

```sql
SELECT * FROM todos WHERE id = 1;
```

Nur erledigte Todos:

```sql
SELECT * FROM todos WHERE completed = true;
```

### UPDATE

Ein Todo als erledigt markieren:

```sql
UPDATE todos SET completed = true WHERE id = 1;
```

### DELETE

Ein Todo löschen:

```sql
DELETE FROM todos WHERE id = 1;
```

## Reflexion

### Warum ist eine strukturierte Datenbank besser als eine JSON-Datei?

- **Datenintegrität**: SQL-Datenbanken erzwingen Typen, Constraints (z. B. Pflichtfelder, Primärschlüssel).
- **Komplexe Abfragen**: Mit SQL kann man effizient nach Kriterien filtern, sortieren und verknüpfen.
- **Skalierbarkeit & Wartbarkeit**: Datenbanken eignen sich besser für große Datenmengen, Backup-Konzepte und professionelle Workflows.

### Zweck des Primärschlüssels

Ein Primärschlüssel (hier: id) identifiziert jede Zeile eindeutig und ermöglicht gezielte Abfragen, Updates und Deletes.

### Abbildung der API-Endpunkte auf SQL-Abfragen

| API-Endpunkt      | SQL-Befehl                      |
|-------------------|----------------------------------|
| GET /todos        | SELECT * FROM todos             |
| GET /todos/:id    | SELECT * FROM todos WHERE id = ? |
| POST /todos       | INSERT INTO todos ...           |
| DELETE /todos/:id | DELETE FROM todos WHERE id = ?  |
| PATCH /todos/:id  | UPDATE todos SET ... WHERE id = ? |

### Warum ist eine Datenbank für containerisierte Anwendungen sinnvoll?

- **Datenpersistenz**: Daten überleben das Löschen oder Erneuern von Containern.
- **Trennung von Code & Daten**: DevOps-Prinzip: saubere Layer, besseres Deployment.
- **Zentralisierte Verwaltung**: Mehrere Container oder Dienste können dieselbe DB verwenden.