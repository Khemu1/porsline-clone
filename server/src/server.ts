import * as dotenv from "dotenv";
import app from "./app";
import { initializeDatabase } from "./config/dbInit";
dotenv.config({ path: `${process.cwd()}/.env` });

const PORT = process.env.SERVER_PORT || 4001;

const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();
