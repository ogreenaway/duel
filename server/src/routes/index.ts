import { Router } from "express";
import programRoutes from "./programRoutes";
import taskRoutes from "./taskRoutes";
import userRoutes from "./userRoutes";

const router = Router();

// Mount route handlers
router.use("/tasks", taskRoutes);
router.use("/programs", programRoutes);
router.use("/users", userRoutes);

export default router;
