import { Router } from "express";
import {
  getAttendanceSummaryReportHandler,
  getDepartmentAttendanceReportHandler,
} from "../controllers/reportController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.get("/attendance-summary", getAttendanceSummaryReportHandler);
router.get("/department-attendance", getDepartmentAttendanceReportHandler);

export default router;
