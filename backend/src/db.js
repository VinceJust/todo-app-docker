import { Pool } from "pg";
import winston from "winston";

// Logging
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.simple()
  ),
  transports: [new winston.transports.Console()],
});

// Verbindungspool mit ENV-Vars
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.on("connect", () => {
  logger.info("PostgreSQL-Pool verbunden");
});

pool.on("error", (err) => {
  logger.error("PostgreSQL-Fehler im Pool:", err.message);
});

export default pool;
