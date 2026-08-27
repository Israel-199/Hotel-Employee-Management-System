import { Router } from "express";
import {
  listAttendanceHandler,
  getAttendanceHandler,
  createAttendanceHandler,
  updateAttendanceHandler,
  deleteAttendanceHandler,
} from "../controllers/attendanceController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.get("/", listAttendanceHandler);
router.get("/:id", getAttendanceHandler);
router.post("/", createAttendanceHandler);
router.put("/:id", updateAttendanceHandler);
router.delete("/:id", deleteAttendanceHandler);

export default router;
