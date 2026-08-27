import { Router } from "express";
import {
  listDepartmentsHandler,
  getDepartmentHandler,
  createDepartmentHandler,
  updateDepartmentHandler,
  deleteDepartmentHandler,
} from "../controllers/departmentController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.get("/", listDepartmentsHandler);
router.get("/:id", getDepartmentHandler);
router.post("/", createDepartmentHandler);
router.put("/:id", updateDepartmentHandler);
router.delete("/:id", deleteDepartmentHandler);

export default router;
