import express, { NextFunction, Request, Response } from "express";
import { getAllPrograms, getProgramById } from "./services/ProgramsService";
import { getAllTasks, getTaskById } from "./services/TasksService";
import { getAllUsers, getUserById } from "./services/UsersService";

import ENV from "@src/common/constants/ENV";
import HttpStatusCodes from "@src/common/constants/HttpStatusCodes";
import { NodeEnvs } from "@src/common/constants";
import Paths from "@src/common/constants/Paths";
import { RouteError } from "@src/common/util/route-errors";
import helmet from "helmet";
import logger from "jet-logger";
import morgan from "morgan";
import path from "path";

// import BaseRouter from "@src/routes";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
// app.use(Paths.Base, BaseRouter);

// Add error handler
app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (ENV.NodeEnv !== NodeEnvs.Test.valueOf()) {
    logger.err(err, true);
  }
  let status = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError) {
    status = err.status;
    res.status(status).json({ error: err.message });
  }
  return next(err);
});

// **** FrontEnd Content **** //

// Set views directory (html)
// const viewsDir = path.join(__dirname, 'views');
// app.set('views', viewsDir);

// Set static directory (js and css).
// const staticDir = path.join(__dirname, 'public');
// app.use(express.static(staticDir));

// Nav to users pg by default
// app.get('/', (_: Request, res: Response) => {
//   return res.redirect('/users');
// });

// Redirect to login if not logged in.
// app.get('/users', (_: Request, res: Response) => {
//   return res.sendFile('users.html', { root: viewsDir });
// });

// Improvement: move to routes

app.get("/tasks", async (_: Request, res: Response) => {
  const tasks = await getAllTasks();
  return res.json(tasks);
});

app.get("/tasks/:id", async (req: Request, res: Response) => {
  const task = await getTaskById(req.params.id);
  return res.json(task);
});

app.get("/programs", async (_: Request, res: Response) => {
  const programs = await getAllPrograms();
  return res.json(programs);
});

app.get("/programs/:id", async (req: Request, res: Response) => {
  const program = await getProgramById(req.params.id);
  return res.json(program);
});

app.get("/users", async (_: Request, res: Response) => {
  const users = await getAllUsers();
  return res.json(users);
});

app.get("/users/:id", async (req: Request, res: Response) => {
  const user = await getUserById(req.params.id);
  return res.json(user);
});

export default app;
