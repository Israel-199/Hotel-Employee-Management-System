import { Router } from "express";
import {
  listEmployeesHandler,
  getEmployeeHandler,
  createEmployeeHandler,
  updateEmployeeHandler,
  deleteEmployeeHandler,
} from "../controllers/employeeController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.get("/", listEmployeesHandler);
router.get("/:id", getEmployeeHandler);
router.post("/", createEmployeeHandler);
router.put("/:id", updateEmployeeHandler);
router.delete("/:id", deleteEmployeeHandler);

export default router;
