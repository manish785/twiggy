// Load .env into process.env before other modules read config values
const dotenv = require("dotenv");
dotenv.config();

// Express app (routes/middleware only — no listen here)
const app = require("./app");
// Shared MySQL pool used for the startup connectivity check
const pool = require("./config/db");
const logger = require("./utils/logger");
const { runMigrations } = require("./config/migrate");
const { initializeDatabaseIfEmpty } = require("../scripts/init-db");

// HTTP port; falls back to 5000 if PORT is unset
const PORT = Number(process.env.PORT || 5000);

async function startServer() {
  try {
    // Ping MySQL with a no-op query to fail fast before accepting traffic
    await pool.query("SELECT 1");
    // eslint-disable-next-line no-console
    console.log("Database connection established");

    await initializeDatabaseIfEmpty(pool);
    await runMigrations(pool, logger);

    // Bind Express to PORT once the database is reachable
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to start backend:", error.message);
    // Non-zero exit so process managers / CI know startup failed
    process.exit(1);
  }
}

// Entry point when run via `npm start` or `npm run dev`
startServer();
