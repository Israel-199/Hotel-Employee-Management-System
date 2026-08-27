import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";

export async function listShifts() {
  const shifts = await prisma.shift.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { employees: true } } },
  });
  return shifts.map((s) => ({
    id: s.id,
    name: s.name,
    startTime: s.startTime,
    endTime: s.endTime,
    description: s.description,
    employeeCount: s._count.employees,
    createdAt: s.createdAt,
    updatedAt: s.updatedAt,
  }));
}

export async function getShiftById(id: string) {
  const shift = await prisma.shift.findUnique({
    where: { id },
    include: { _count: { select: { employees: true } } },
  });
  if (!shift) throw new AppError("Shift not found.", 404);
  return {
    id: shift.id,
    name: shift.name,
    startTime: shift.startTime,
    endTime: shift.endTime,
    description: shift.description,
    employeeCount: shift._count.employees,
    createdAt: shift.createdAt,
    updatedAt: shift.updatedAt,
  };
}

export async function createShift(data: {
  name: string;
  startTime: string;
  endTime: string;
  description?: string | null;
}) {
  return prisma.shift.create({ data });
}

export async function updateShift(
  id: string,
  data: Partial<{
    name: string;
    startTime: string;
    endTime: string;
    description: string | null;
  }>
) {
  await getShiftById(id);
  return prisma.shift.update({ where: { id }, data });
}

export async function deleteShift(id: string) {
  await getShiftById(id);
  const count = await prisma.employee.count({ where: { shiftId: id } });
  if (count > 0) {
    throw new AppError("Cannot delete shift with assigned employees.", 409);
  }
  await prisma.shift.delete({ where: { id } });
}
