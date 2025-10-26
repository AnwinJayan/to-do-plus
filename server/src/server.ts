import dotenv from "dotenv";

dotenv.config();

import app from "./app.js";
import connectDB from "./config/db.js";

export const startServer = async (): Promise<void> => {
  const port = process.env.PORT || 5000;

  try {
    await connectDB(process.env.MONGO_URI || "");
    console.log("DB connected.");
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
      console.log(`📚 Swagger docs at http://localhost:${port}/api-docs`);
    });
  } catch (err) {
    console.error("Startup failed.");
    process.exit(1);
  }
};

startServer();
