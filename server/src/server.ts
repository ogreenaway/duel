import express, { NextFunction, Request, Response } from "express";

import cors from "cors";
import helmet from "helmet";
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

// Routes
app.use(routes);

// Error handler
app.use((error: Error, _: Request, res: Response, next: NextFunction) => {
  let status = 500;
  let message = "Internal server error";
  res.status(status).json({ error: message });
});

export default app;
