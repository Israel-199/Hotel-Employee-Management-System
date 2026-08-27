import { prisma } from "../lib/prisma";
import { parseDateOnly } from "../utils/prismaErrors";

export interface AttendanceReportFilter {
  startDate?: string;
  endDate?: string;
  departmentId?: string;
}

export async function getEmployeeAttendanceReport(filter: AttendanceReportFilter) {
  const dateWhere: Record<string, unknown> = {};
  if (filter.startDate) {
    dateWhere.gte = parseDateOnly(filter.startDate);
  }
  if (filter.endDate) {
    dateWhere.lte = parseDateOnly(filter.endDate);
  }

  const employeeWhere: Record<string, unknown> = {};
  if (filter.departmentId) {
    employeeWhere.departmentId = filter.departmentId;
  }

  const employees = await prisma.employee.findMany({
    where: employeeWhere,
    select: {
      id: true,
      employeeNumber: true,
      firstName: true,
      lastName: true,
      department: {
        select: {
          id: true,
          name: true,
        },
      },
      attendance: {
        where: Object.keys(dateWhere).length > 0 ? { date: dateWhere } : undefined,
        select: {
          status: true,
        },
      },
    },
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
  });

  const report = employees.map((emp) => {
    let present = 0;
    let absent = 0;
    let late = 0;
    let leave = 0;

    for (const record of emp.attendance) {
      switch (record.status) {
        case "PRESENT":
          present++;
          break;
        case "ABSENT":
          absent++;
          break;
        case "LATE":
          late++;
          break;
        case "LEAVE":
          leave++;
          break;
      }
    }

    const totalDays = emp.attendance.length;
    const attendanceRate =
      totalDays > 0 ? Math.round(((present + late) / totalDays) * 100 * 10) / 10 : 0;

    return {
      employeeId: emp.id,
      employeeNumber: emp.employeeNumber,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      departmentId: emp.department.id,
      departmentName: emp.department.name,
      totalDays,
      present,
      absent,
      late,
      leave,
      attendanceRate,
    };
  });

  return report;
}

export async function getDepartmentAttendanceReport(filter: AttendanceReportFilter) {
  const dateWhere: Record<string, unknown> = {};
  if (filter.startDate) {
    dateWhere.gte = parseDateOnly(filter.startDate);
  }
  if (filter.endDate) {
    dateWhere.lte = parseDateOnly(filter.endDate);
  }

  const departments = await prisma.department.findMany({
    select: {
      id: true,
      name: true,
      employees: {
        select: {
          id: true,
          attendance: {
            where: Object.keys(dateWhere).length > 0 ? { date: dateWhere } : undefined,
            select: {
              status: true,
            },
          },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  const report = departments.map((dept) => {
    const totalEmployees = dept.employees.length;
    let present = 0;
    let absent = 0;
    let late = 0;
    let leave = 0;
    let totalRecordedDays = 0;

    for (const emp of dept.employees) {
      for (const record of emp.attendance) {
        totalRecordedDays++;
        switch (record.status) {
          case "PRESENT":
            present++;
            break;
          case "ABSENT":
            absent++;
            break;
          case "LATE":
            late++;
            break;
          case "LEAVE":
            leave++;
            break;
        }
      }
    }

    const attendanceRate =
      totalRecordedDays > 0
        ? Math.round(((present + late) / totalRecordedDays) * 100 * 10) / 10
        : 0;

    return {
      departmentId: dept.id,
      departmentName: dept.name,
      totalEmployees,
      totalRecordedDays,
      present,
      absent,
      late,
      leave,
      attendanceRate,
    };
  });

  return report;
}
