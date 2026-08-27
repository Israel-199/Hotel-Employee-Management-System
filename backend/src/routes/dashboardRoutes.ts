import { Router } from "express";
import { getDashboardSummaryHandler } from "../controllers/dashboardController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.get("/summary", getDashboardSummaryHandler);

export default router;
