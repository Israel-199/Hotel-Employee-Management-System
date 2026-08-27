export interface Admin {
  id: string;
  email: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string | null;
  employeeCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string | null;
  employeeCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  description?: string | null;
  employeeCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type EmployeeStatus = "ACTIVE" | "INACTIVE" | "ON_LEAVE" | "TERMINATED";

export interface Employee {
  id: string;
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
  department?: { id: string; name: string };
  role?: { id: string; name: string };
  shift?: { id: string; name: string; startTime: string; endTime: string };
  createdAt: string;
  updatedAt: string;
}

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "LEAVE";

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  status: AttendanceStatus;
  checkIn?: string | null;
  checkOut?: string | null;
  notes?: string | null;
  employee?: {
    id: string;
    employeeNumber: string;
    firstName: string;
    lastName: string;
    department?: { id: string; name: string };
  };
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  totalEmployees: number;
  totalDepartments: number;
  totalRoles: number;
  totalShifts: number;
  todayPresent: number;
  todayAbsent: number;
  todayLate: number;
  todayLeave: number;
}

export interface EmployeeAttendanceReportItem {
  employeeId: string;
  employeeNumber: string;
  employeeName: string;
  departmentId: string;
  departmentName: string;
  totalDays: number;
  present: number;
  absent: number;
  late: number;
  leave: number;
  attendanceRate: number;
}

export interface DepartmentAttendanceReportItem {
  departmentId: string;
  departmentName: string;
  totalEmployees: number;
  totalRecordedDays: number;
  present: number;
  absent: number;
  late: number;
  leave: number;
  attendanceRate: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: Pagination;
}
