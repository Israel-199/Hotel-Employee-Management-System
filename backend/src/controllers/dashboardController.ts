import { Request, Response, NextFunction } from "express";
import { getDashboardSummary } from "../services/dashboardService";

export async function getDashboardSummaryHandler(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const summary = await getDashboardSummary();
    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
}
