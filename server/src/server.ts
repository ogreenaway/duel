import express, { NextFunction, Request, Response } from "express";

import ENV from "@src/common/constants/ENV";
import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";
import { NodeEnvs } from "@src/common/constants";
import { RouteError } from "@src/common/util/route-errors";
import cors from "cors";
import helmet from "helmet";
import logger from "jet-logger";
import morgan from "morgan";
import routes from "./routes";

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.use(routes);

// Error handler
app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (ENV.NodeEnv !== NodeEnvs.Test.valueOf()) {
    logger.err(err, true);
  }

  let status = HttpStatusCodes.INTERNAL_SERVER_ERROR;
  let message = "Internal server error";

  if (err instanceof RouteError) {
    status = err.status;
    message = err.message;
  }

  // Send response and don't call next() after sending
  res.status(status).json({ error: message });
});

export default app;
