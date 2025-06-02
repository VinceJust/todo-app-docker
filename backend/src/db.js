import { Pool } from "pg";
import winston from "winston";

// Winston-Logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console()],
});

// === ENV-Check: Fehlt was? ===
const requiredVars = ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME"];
for (const name of requiredVars) {
  if (!process.env[name]) {
    logger.warn(`WARN: Umgebungsvariable ${name} ist nicht gesetzt`);
  }
}

// === Verbindungspool mit Timeout-Optionen ===
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  // optional aber empfohlen:
  idleTimeoutMillis: 10000,           // Inaktive Verbindungen nach 10s schließen
  connectionTimeoutMillis: 3000,       // Verbindungsaufbau maximal 3s

  ssl: false
});

// === Logging beim Verbindungsstatus ===
pool.on("connect", () => {
  logger.info("PostgreSQL-Pool verbunden");
});

pool.on("error", (err) => {
  logger.error("PostgreSQL-Fehler im Pool:", err.message);
});

export default pool;
