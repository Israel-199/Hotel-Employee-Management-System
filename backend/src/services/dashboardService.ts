import { prisma } from "../lib/prisma";
import { startOfTodayUTC, endOfTodayUTC } from "../utils/prismaErrors";

export async function getDashboardSummary() {
  const todayStart = startOfTodayUTC();
  const todayEnd = endOfTodayUTC();

  const [
    totalEmployees,
    totalDepartments,
    totalRoles,
    totalShifts,
    todayAttendance,
  ] = await Promise.all([
    prisma.employee.count(),
    prisma.department.count(),
    prisma.role.count(),
    prisma.shift.count(),
    prisma.attendance.findMany({
      where: {
        date: {
          gte: todayStart,
          lt: todayEnd,
        },
      },
      select: {
        status: true,
      },
    }),
  ]);

  let todayPresent = 0;
  let todayAbsent = 0;
  let todayLate = 0;
  let todayLeave = 0;

  for (const record of todayAttendance) {
    switch (record.status) {
      case "PRESENT":
        todayPresent++;
        break;
      case "ABSENT":
        todayAbsent++;
        break;
      case "LATE":
        todayLate++;
        break;
      case "LEAVE":
        todayLeave++;
        break;
    }
  }

  return {
    totalEmployees,
    totalDepartments,
    totalRoles,
    totalShifts,
    todayPresent,
    todayAbsent,
    todayLate,
    todayLeave,
  };
}
