import './config/env';
import app from "./app";
import { pool } from "./config/db";

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    // Verify DB connection before listening
    await pool.query("SELECT 1");
    console.log("PostgreSQL connected");

    app.listen(PORT, () => {
      console.log(`Node API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

// Debug: List all registered routes
if (app._router && app._router.stack) {
  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      console.log("Registered Route:", middleware.route.path);
    }
  });
} else {
  console.error("No routes are registered in the app.");
}

startServer();
