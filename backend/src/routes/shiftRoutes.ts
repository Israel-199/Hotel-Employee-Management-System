import { Router } from "express";
import {
  listShiftsHandler,
  getShiftHandler,
  createShiftHandler,
  updateShiftHandler,
  deleteShiftHandler,
} from "../controllers/shiftController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.get("/", listShiftsHandler);
router.get("/:id", getShiftHandler);
router.post("/", createShiftHandler);
router.put("/:id", updateShiftHandler);
router.delete("/:id", deleteShiftHandler);

export default router;
