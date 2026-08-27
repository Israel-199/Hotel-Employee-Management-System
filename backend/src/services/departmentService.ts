import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";

export async function listDepartments() {
  const departments = await prisma.department.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { employees: true } } },
  });
  return departments.map((d) => ({
    id: d.id,
    name: d.name,
    description: d.description,
    employeeCount: d._count.employees,
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  }));
}

export async function getDepartmentById(id: string) {
  const department = await prisma.department.findUnique({
    where: { id },
    include: { _count: { select: { employees: true } } },
  });
  if (!department) throw new AppError("Department not found.", 404);
  return {
    id: department.id,
    name: department.name,
    description: department.description,
    employeeCount: department._count.employees,
    createdAt: department.createdAt,
    updatedAt: department.updatedAt,
  };
}

export async function createDepartment(data: { name: string; description?: string | null }) {
  return prisma.department.create({ data });
}

export async function updateDepartment(
  id: string,
  data: { name?: string; description?: string | null }
) {
  const existing = await prisma.department.findUnique({ where: { id } });
  if (!existing) throw new AppError("Department not found.", 404);

  let hasChanges = false;
  if (data.name !== undefined && data.name !== existing.name) hasChanges = true;
  if (
    data.description !== undefined &&
    (data.description ?? null) !== (existing.description ?? null)
  ) {
    hasChanges = true;
  }

  if (!hasChanges) {
    throw new AppError("No changes were made.", 400);
  }

  return prisma.department.update({ where: { id }, data });
}

export async function deleteDepartment(id: string) {
  const department = await getDepartmentById(id);
  if (department.employeeCount > 0) {
    throw new AppError("Cannot delete department with assigned employees.", 409);
  }
  await prisma.department.delete({ where: { id } });
}
