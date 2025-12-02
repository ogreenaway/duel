import { Router } from "express";
import programRoutes from "./programRoutes";
import taskRoutes from "./taskRoutes";
import topUsersReportRoutes from "./topUsersReportRoutes";
import userRoutes from "./userRoutes";

const router = Router();

// Mount route handlers
router.use("/tasks", taskRoutes);
router.use("/programs", programRoutes);
router.use("/users", userRoutes);
// TODO: Remove "top"
router.use("/reports/users/top", topUsersReportRoutes);

export default router;
