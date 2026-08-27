import { Router } from "express";
import authRoutes from "./authRoutes";
import employeeRoutes from "./employeeRoutes";
import departmentRoutes from "./departmentRoutes";
import roleRoutes from "./roleRoutes";
import shiftRoutes from "./shiftRoutes";
import attendanceRoutes from "./attendanceRoutes";
import dashboardRoutes from "./dashboardRoutes";
import reportRoutes from "./reportRoutes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/employees", employeeRoutes);
router.use("/departments", departmentRoutes);
router.use("/roles", roleRoutes);
router.use("/shifts", shiftRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/reports", reportRoutes);

export default router;
