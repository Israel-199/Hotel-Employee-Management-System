import { Request, Response, NextFunction } from "express";
import {
  listRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from "../services/roleService";
import { roleSchema } from "../utils/validation";

export async function listRolesHandler(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const roles = await listRoles();
    res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (error) {
    next(error);
  }
}

export async function getRoleHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const role = await getRoleById(req.params.id as string);
    res.status(200).json({
      success: true,
      data: role,
    });
  } catch (error) {
    next(error);
  }
}

export async function createRoleHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = roleSchema.parse(req.body);
    const newRole = await createRole(validatedData);
    res.status(201).json({
      success: true,
      data: newRole,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateRoleHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const updated = await updateRole(req.params.id as string, req.body);
    res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteRoleHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await deleteRole(req.params.id as string);
    res.status(200).json({
      success: true,
      message: "Role deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}
