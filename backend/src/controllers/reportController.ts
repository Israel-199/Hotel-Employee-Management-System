import { Request, Response, NextFunction } from "express";
import {
  getEmployeeAttendanceReport,
  getDepartmentAttendanceReport,
} from "../services/reportService";

export async function getAttendanceSummaryReportHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const startDate = (req.query.startDate as string) || undefined;
    const endDate = (req.query.endDate as string) || undefined;
    const departmentId = (req.query.departmentId as string) || undefined;

    const report = await getEmployeeAttendanceReport({ startDate, endDate, departmentId });

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
}

export async function getDepartmentAttendanceReportHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const startDate = (req.query.startDate as string) || undefined;
    const endDate = (req.query.endDate as string) || undefined;

    const report = await getDepartmentAttendanceReport({ startDate, endDate });

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (error) {
    next(error);
  }
}
