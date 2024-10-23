// server.ts
import * as dotenv from "dotenv";
import http from "http";
import { initializeDatabase } from "./config/dbInit"; // Ensure this points to your db init file
import { initializeSocket } from "./handlers/socketHandler";
import app from "./app";

dotenv.config({ path: `${process.cwd()}/.env` });

const PORT = process.env.SERVER_PORT || 4001;

const server = http.createServer(app);

export const io = initializeSocket(server);

const startServer = async () => {
  try {
    await initializeDatabase();

    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
    process.exit(1);
  }
};

startServer();
