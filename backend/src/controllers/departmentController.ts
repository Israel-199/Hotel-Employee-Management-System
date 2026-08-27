import { Request, Response, NextFunction } from "express";
import {
  listDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../services/departmentService";
import { departmentSchema } from "../utils/validation";

export async function listDepartmentsHandler(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const departments = await listDepartments();
    res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error) {
    next(error);
  }
}

export async function getDepartmentHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const department = await getDepartmentById(req.params.id);
    res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    next(error);
  }
}

export async function createDepartmentHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = departmentSchema.parse(req.body);
    const newDepartment = await createDepartment(validatedData);
    res.status(201).json({
      success: true,
      data: newDepartment,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateDepartmentHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const updated = await updateDepartment(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteDepartmentHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await deleteDepartment(req.params.id);
    res.status(200).json({
      success: true,
      message: "Department deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}
