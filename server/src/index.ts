import ENV from "@src/common/constants/ENV";
import logger from "jet-logger";
import mongoDb from "@src/database/MongoDb";
import server from "./server";

(async () => {
  try {
    await mongoDb.connect();
    logger.info("Connected to MongoDB");

    const PORT = 5000;
    server.listen(PORT, (error) => {
      if (!!error) {
        logger.err(error.message);
      } else {
        logger.info("Express server started on port: " + PORT.toString());
      }
    });

    process.on("SIGINT", async () => {
      logger.info("Shutting down gracefully...");
      await mongoDb.close();
      process.exit(0);
    });

    process.on("SIGTERM", async () => {
      logger.info("Shutting down gracefully...");
      await mongoDb.close();
      process.exit(0);
    });
  } catch (error) {
    logger.err("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
})();
