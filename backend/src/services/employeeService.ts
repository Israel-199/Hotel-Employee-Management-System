import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";
import { parseDateOnly } from "../utils/prismaErrors";
import { EmployeeStatus } from "@prisma/client";

const employeeInclude = {
  department: { select: { id: true, name: true } },
  role: { select: { id: true, name: true } },
  shift: { select: { id: true, name: true, startTime: true, endTime: true } },
};

async function validateEmployeeRelations(
  departmentId: string,
  roleId: string,
  shiftId: string
) {
  const [department, role, shift] = await Promise.all([
    prisma.department.findUnique({ where: { id: departmentId } }),
    prisma.role.findUnique({ where: { id: roleId } }),
    prisma.shift.findUnique({ where: { id: shiftId } }),
  ]);

  if (!department) throw new AppError("Department not found.", 404);
  if (!role) throw new AppError("Role not found.", 404);
  if (!shift) throw new AppError("Shift not found.", 404);
}

export async function listEmployees(params: {
  page: number;
  limit: number;
  skip: number;
  search?: string;
  departmentId?: string;
  status?: EmployeeStatus;
}) {
  const where: Record<string, unknown> = {};

  if (params.search) {
    where.OR = [
      { firstName: { contains: params.search, mode: "insensitive" } },
      { lastName: { contains: params.search, mode: "insensitive" } },
      { email: { contains: params.search, mode: "insensitive" } },
      { employeeNumber: { contains: params.search, mode: "insensitive" } },
    ];
  }
  if (params.departmentId) where.departmentId = params.departmentId;
  if (params.status) where.status = params.status;

  const [employees, total] = await Promise.all([
    prisma.employee.findMany({
      where,
      include: employeeInclude,
      orderBy: { createdAt: "desc" },
      skip: params.skip,
      take: params.limit,
    }),
    prisma.employee.count({ where }),
  ]);

  return { employees, total };
}

export async function getEmployeeById(id: string) {
  const employee = await prisma.employee.findUnique({
    where: { id },
    include: employeeInclude,
  });
  if (!employee) throw new AppError("Employee not found.", 404);
  return employee;
}

export async function createEmployee(data: {
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  hireDate: string;
  departmentId: string;
  roleId: string;
  shiftId: string;
  status: EmployeeStatus;
}) {
  await validateEmployeeRelations(data.departmentId, data.roleId, data.shiftId);

  return prisma.employee.create({
    data: {
      ...data,
      hireDate: parseDateOnly(data.hireDate),
    },
    include: employeeInclude,
  });
}

export async function updateEmployee(
  id: string,
  data: Partial<{
    employeeNumber: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    hireDate: string;
    departmentId: string;
    roleId: string;
    shiftId: string;
    status: EmployeeStatus;
  }>
) {
  const existing = await prisma.employee.findUnique({ where: { id } });
  if (!existing) throw new AppError("Employee not found.", 404);

  let hasChanges = false;
  if (data.employeeNumber !== undefined && data.employeeNumber !== existing.employeeNumber) hasChanges = true;
  if (data.firstName !== undefined && data.firstName !== existing.firstName) hasChanges = true;
  if (data.lastName !== undefined && data.lastName !== existing.lastName) hasChanges = true;
  if (data.email !== undefined && data.email.trim().toLowerCase() !== existing.email.trim().toLowerCase()) hasChanges = true;
  if (data.phone !== undefined && (data.phone ?? null) !== (existing.phone ?? null)) hasChanges = true;
  if (data.departmentId !== undefined && data.departmentId !== existing.departmentId) hasChanges = true;
  if (data.roleId !== undefined && data.roleId !== existing.roleId) hasChanges = true;
  if (data.shiftId !== undefined && data.shiftId !== existing.shiftId) hasChanges = true;
  if (data.status !== undefined && data.status !== existing.status) hasChanges = true;
  if (data.hireDate !== undefined) {
    const newHireDate = parseDateOnly(data.hireDate).toISOString();
    const oldHireDate = existing.hireDate.toISOString();
    if (newHireDate !== oldHireDate) hasChanges = true;
  }

  if (!hasChanges) {
    throw new AppError("No changes were made.", 400);
  }

  if (data.departmentId || data.roleId || data.shiftId) {
    await validateEmployeeRelations(
      data.departmentId || existing.departmentId,
      data.roleId || existing.roleId,
      data.shiftId || existing.shiftId
    );
  }

  const updateData: Record<string, unknown> = { ...data };
  if (data.hireDate) {
    updateData.hireDate = parseDateOnly(data.hireDate);
  }

  return prisma.employee.update({
    where: { id },
    data: updateData,
    include: employeeInclude,
  });
}

export async function deleteEmployee(id: string) {
  const existing = await prisma.employee.findUnique({ where: { id } });
  if (!existing) throw new AppError("Employee not found.", 404);
  await prisma.employee.delete({ where: { id } });
}
