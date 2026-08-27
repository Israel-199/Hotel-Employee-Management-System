import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";
import { parseDateOnly } from "../utils/prismaErrors";
import { AttendanceStatus } from "@prisma/client";

const attendanceInclude = {
  employee: {
    select: {
      id: true,
      employeeNumber: true,
      firstName: true,
      lastName: true,
      department: { select: { id: true, name: true } },
    },
  },
};

function parseDateTime(value: string | null | undefined): Date | null {
  if (!value) return null;
  const dt = new Date(value);
  if (isNaN(dt.getTime())) {
    throw new AppError("Invalid date/time format.", 400);
  }
  return dt;
}

export async function listAttendance(params: {
  page: number;
  limit: number;
  skip: number;
  date?: string;
  employeeId?: string;
  status?: AttendanceStatus;
}) {
  const where: Record<string, unknown> = {};
  if (params.date) where.date = parseDateOnly(params.date);
  if (params.employeeId) where.employeeId = params.employeeId;
  if (params.status) where.status = params.status;

  const [records, total] = await Promise.all([
    prisma.attendance.findMany({
      where,
      include: attendanceInclude,
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      skip: params.skip,
      take: params.limit,
    }),
    prisma.attendance.count({ where }),
  ]);

  return { records, total };
}

export async function getAttendanceById(id: string) {
  const record = await prisma.attendance.findUnique({
    where: { id },
    include: attendanceInclude,
  });
  if (!record) throw new AppError("Attendance record not found.", 404);
  return record;
}

export async function createAttendance(data: {
  employeeId: string;
  date: string;
  status: AttendanceStatus;
  checkIn?: string | null;
  checkOut?: string | null;
  notes?: string | null;
}) {
  const employee = await prisma.employee.findUnique({ where: { id: data.employeeId } });
  if (!employee) throw new AppError("Employee not found.", 404);

  return prisma.attendance.create({
    data: {
      employeeId: data.employeeId,
      date: parseDateOnly(data.date),
      status: data.status,
      checkIn: parseDateTime(data.checkIn),
      checkOut: parseDateTime(data.checkOut),
      notes: data.notes,
    },
    include: attendanceInclude,
  });
}

export async function updateAttendance(
  id: string,
  data: Partial<{
    employeeId: string;
    date: string;
    status: AttendanceStatus;
    checkIn: string | null;
    checkOut: string | null;
    notes: string | null;
  }>
) {
  const existing = await prisma.attendance.findUnique({ where: { id } });
  if (!existing) throw new AppError("Attendance record not found.", 404);

  let hasChanges = false;
  if (data.employeeId !== undefined && data.employeeId !== existing.employeeId) hasChanges = true;
  if (data.status !== undefined && data.status !== existing.status) hasChanges = true;
  if (data.notes !== undefined && (data.notes ?? null) !== (existing.notes ?? null)) hasChanges = true;
  if (data.date !== undefined) {
    const newDate = parseDateOnly(data.date).toISOString();
    const oldDate = existing.date.toISOString();
    if (newDate !== oldDate) hasChanges = true;
  }
  if (data.checkIn !== undefined) {
    const newCheckIn = data.checkIn ? parseDateTime(data.checkIn)?.toISOString() ?? null : null;
    const oldCheckIn = existing.checkIn?.toISOString() ?? null;
    if (newCheckIn !== oldCheckIn) hasChanges = true;
  }
  if (data.checkOut !== undefined) {
    const newCheckOut = data.checkOut ? parseDateTime(data.checkOut)?.toISOString() ?? null : null;
    const oldCheckOut = existing.checkOut?.toISOString() ?? null;
    if (newCheckOut !== oldCheckOut) hasChanges = true;
  }

  if (!hasChanges) {
    throw new AppError("No changes were made.", 400);
  }

  if (data.employeeId) {
    const employee = await prisma.employee.findUnique({ where: { id: data.employeeId } });
    if (!employee) throw new AppError("Employee not found.", 404);
  }

  const updateData: Record<string, unknown> = {};
  if (data.employeeId) updateData.employeeId = data.employeeId;
  if (data.date) updateData.date = parseDateOnly(data.date);
  if (data.status) updateData.status = data.status;
  if (data.checkIn !== undefined) updateData.checkIn = parseDateTime(data.checkIn);
  if (data.checkOut !== undefined) updateData.checkOut = parseDateTime(data.checkOut);
  if (data.notes !== undefined) updateData.notes = data.notes;

  return prisma.attendance.update({
    where: { id },
    data: updateData,
    include: attendanceInclude,
  });
}

export async function deleteAttendance(id: string) {
  const existing = await prisma.attendance.findUnique({ where: { id } });
  if (!existing) throw new AppError("Attendance record not found.", 404);
  await prisma.attendance.delete({ where: { id } });
}
