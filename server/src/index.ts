import mongoDb from "@src/database/MongoDb";
import server from "./server";

(async () => {
  try {
    await mongoDb.connect();
    console.info("Connected to MongoDB");

    const PORT = 5000;
    server.listen(PORT, (error) => {
      if (!!error) {
        console.error(error.message);
      } else {
        console.info("Express server started on port: " + PORT.toString());
      }
    });

    process.on("SIGINT", async () => {
      console.info("Shutting down gracefully...");
      await mongoDb.close();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      console.info("Shutting down gracefully...");
      await mongoDb.close();
      process.exit(0);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
})();
