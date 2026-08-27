import { Request, Response, NextFunction } from "express";
import {
  listAttendance,
  getAttendanceById,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} from "../services/attendanceService";
import { attendanceSchema } from "../utils/validation";
import { AttendanceStatus } from "@prisma/client";

export async function listAttendanceHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;
    const date = (req.query.date as string) || undefined;
    const employeeId = (req.query.employeeId as string) || undefined;
    const status = (req.query.status as AttendanceStatus) || undefined;

    const { records, total } = await listAttendance({
      page,
      limit,
      skip,
      date,
      employeeId,
      status,
    });

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: records,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getAttendanceHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const record = await getAttendanceById(req.params.id as string);
    res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
}

export async function createAttendanceHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = attendanceSchema.parse(req.body);
    const record = await createAttendance(validatedData);
    res.status(201).json({
      success: true,
      data: record,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateAttendanceHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = attendanceSchema.partial().parse(req.body);
    const updated = await updateAttendance(req.params.id as string, validatedData);
    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteAttendanceHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await deleteAttendance(req.params.id as string);
    res.status(200).json({
      success: true,
      message: "Attendance record deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}
