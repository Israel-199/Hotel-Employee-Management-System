import { Request, Response, NextFunction } from "express";
import {
  listEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../services/employeeService";
import { employeeSchema } from "../utils/validation";
import { EmployeeStatus } from "@prisma/client";

export async function listEmployeesHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
    const skip = (page - 1) * limit;
    const search = (req.query.search as string) || undefined;
    const departmentId = (req.query.departmentId as string) || undefined;
    const status = (req.query.status as EmployeeStatus) || undefined;

    const { employees, total } = await listEmployees({
      page,
      limit,
      skip,
      search,
      departmentId,
      status,
    });

    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: employees,
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

export async function getEmployeeHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const employee = await getEmployeeById(req.params.id);
    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    next(error);
  }
}

export async function createEmployeeHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = employeeSchema.parse(req.body);
    const newEmployee = await createEmployee(validatedData);
    res.status(201).json({
      success: true,
      data: newEmployee,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateEmployeeHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const updated = await updateEmployee(req.params.id, req.body);
    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteEmployeeHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await deleteEmployee(req.params.id);
    res.status(200).json({
      success: true,
      message: "Employee deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}
