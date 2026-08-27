import { Request, Response, NextFunction } from "express";
import {
  listShifts,
  getShiftById,
  createShift,
  updateShift,
  deleteShift,
} from "../services/shiftService";
import { shiftSchema } from "../utils/validation";

export async function listShiftsHandler(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const shifts = await listShifts();
    res.status(200).json({
      success: true,
      data: shifts,
    });
  } catch (error) {
    next(error);
  }
}

export async function getShiftHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const shift = await getShiftById(req.params.id as string);
    res.status(200).json({
      success: true,
      data: shift,
    });
  } catch (error) {
    next(error);
  }
}

export async function createShiftHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = shiftSchema.parse(req.body);
    const newShift = await createShift(validatedData);
    res.status(201).json({
      success: true,
      data: newShift,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateShiftHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = shiftSchema.partial().parse(req.body);
    const updated = await updateShift(req.params.id as string, validatedData);
    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteShiftHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await deleteShift(req.params.id as string);
    res.status(200).json({
      success: true,
      message: "Shift deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}
