import { Router } from "express";
import mirrorRoutes from "./mirrorRoutes";
import outliersReportRoutes from "./outliersReportRoutes";
import programRoutes from "./programRoutes";
import taskRoutes from "./taskRoutes";
import topProgramReportRoutes from "./topProgramReportRoutes";
import topUsersReportRoutes from "./topUsersReportRoutes";
import userRoutes from "./userRoutes";

const router = Router();

// Basic GET routes
router.use("/tasks", taskRoutes);
router.use("/programs", programRoutes);
router.use("/users", userRoutes);
// Reporting routes
router.use("/reports/users/top", topUsersReportRoutes);
router.use("/reports/programs/top", topProgramReportRoutes);
router.use("/reports/correlation-coefficients", outliersReportRoutes);
// Return the users in the format of the initial data
router.use("/mirror", mirrorRoutes);

export default router;
