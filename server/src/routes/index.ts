import { Router } from "express";
import programRoutes from "./programRoutes";
import taskRoutes from "./taskRoutes";
import topProgramReportRoutes from "./topProgramReportRoutes";
import topUsersReportRoutes from "./topUsersReportRoutes";
import userRoutes from "./userRoutes";

const router = Router();

// Mount route handlers
router.use("/tasks", taskRoutes);
router.use("/programs", programRoutes);
router.use("/users", userRoutes);
router.use("/reports/users/top", topUsersReportRoutes);
router.use("/reports/programs/top", topProgramReportRoutes);

export default router;
