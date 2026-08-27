import { apiClient } from "./client";
import {
  Admin,
  Department,
  Role,
  Shift,
  Employee,
  Attendance,
  DashboardSummary,
  EmployeeAttendanceReportItem,
  DepartmentAttendanceReportItem,
  ApiResponse,
  EmployeeStatus,
  AttendanceStatus,
} from "./types";

export * from "./types";

export async function loginApi(email: string, password: string): Promise<ApiResponse<{ admin: Admin }>> {
  const response = await apiClient.post("/auth/login", { email, password });
  return response.data;
}

export async function getMeApi(): Promise<ApiResponse<Admin>> {
  const response = await apiClient.get("/auth/me");
  return response.data;
}

export async function logoutApi(): Promise<ApiResponse<null>> {
  const response = await apiClient.post("/auth/logout");
  return response.data;
}

export async function getDashboardSummaryApi(): Promise<ApiResponse<DashboardSummary>> {
  const response = await apiClient.get("/dashboard/summary");
  return response.data;
}

export interface GetEmployeesParams {
  page?: number;
  limit?: number;
  search?: string;
  departmentId?: string;
  status?: EmployeeStatus;
}

export async function getEmployeesApi(params?: GetEmployeesParams): Promise<ApiResponse<Employee[]>> {
  const response = await apiClient.get("/employees", { params });
  return response.data;
}

export async function getEmployeeByIdApi(id: string): Promise<ApiResponse<Employee>> {
  const response = await apiClient.get(`/employees/${id}`);
  return response.data;
}

export async function createEmployeeApi(data: Partial<Employee>): Promise<ApiResponse<Employee>> {
  const response = await apiClient.post("/employees", data);
  return response.data;
}

export async function updateEmployeeApi(id: string, data: Partial<Employee>): Promise<ApiResponse<Employee>> {
  const response = await apiClient.put(`/employees/${id}`, data);
  return response.data;
}

export async function deleteEmployeeApi(id: string): Promise<ApiResponse<null>> {
  const response = await apiClient.delete(`/employees/${id}`);
  return response.data;
}

export async function getDepartmentsApi(): Promise<ApiResponse<Department[]>> {
  const response = await apiClient.get("/departments");
  return response.data;
}

export async function createDepartmentApi(data: { name: string; description?: string }): Promise<ApiResponse<Department>> {
  const response = await apiClient.post("/departments", data);
  return response.data;
}

export async function updateDepartmentApi(id: string, data: { name?: string; description?: string }): Promise<ApiResponse<Department>> {
  const response = await apiClient.put(`/departments/${id}`, data);
  return response.data;
}

export async function deleteDepartmentApi(id: string): Promise<ApiResponse<null>> {
  const response = await apiClient.delete(`/departments/${id}`);
  return response.data;
}

export async function getRolesApi(): Promise<ApiResponse<Role[]>> {
  const response = await apiClient.get("/roles");
  return response.data;
}

export async function createRoleApi(data: { name: string; description?: string }): Promise<ApiResponse<Role>> {
  const response = await apiClient.post("/roles", data);
  return response.data;
}

export async function updateRoleApi(id: string, data: { name?: string; description?: string }): Promise<ApiResponse<Role>> {
  const response = await apiClient.put(`/roles/${id}`, data);
  return response.data;
}

export async function deleteRoleApi(id: string): Promise<ApiResponse<null>> {
  const response = await apiClient.delete(`/roles/${id}`);
  return response.data;
}

export async function getShiftsApi(): Promise<ApiResponse<Shift[]>> {
  const response = await apiClient.get("/shifts");
  return response.data;
}

export async function createShiftApi(data: { name: string; startTime: string; endTime: string; description?: string }): Promise<ApiResponse<Shift>> {
  const response = await apiClient.post("/shifts", data);
  return response.data;
}

export async function updateShiftApi(id: string, data: Partial<Shift>): Promise<ApiResponse<Shift>> {
  const response = await apiClient.put(`/shifts/${id}`, data);
  return response.data;
}

export async function deleteShiftApi(id: string): Promise<ApiResponse<null>> {
  const response = await apiClient.delete(`/shifts/${id}`);
  return response.data;
}

export interface GetAttendanceParams {
  page?: number;
  limit?: number;
  date?: string;
  employeeId?: string;
  status?: AttendanceStatus;
}

export async function getAttendanceApi(params?: GetAttendanceParams): Promise<ApiResponse<Attendance[]>> {
  const response = await apiClient.get("/attendance", { params });
  return response.data;
}

export async function createAttendanceApi(data: Partial<Attendance>): Promise<ApiResponse<Attendance>> {
  const response = await apiClient.post("/attendance", data);
  return response.data;
}

export async function updateAttendanceApi(id: string, data: Partial<Attendance>): Promise<ApiResponse<Attendance>> {
  const response = await apiClient.put(`/attendance/${id}`, data);
  return response.data;
}

export async function deleteAttendanceApi(id: string): Promise<ApiResponse<null>> {
  const response = await apiClient.delete(`/attendance/${id}`);
  return response.data;
}

export interface ReportFilterParams {
  startDate?: string;
  endDate?: string;
  departmentId?: string;
}

export async function getAttendanceSummaryReportApi(params?: ReportFilterParams): Promise<ApiResponse<EmployeeAttendanceReportItem[]>> {
  const response = await apiClient.get("/reports/attendance-summary", { params });
  return response.data;
}

export async function getDepartmentAttendanceReportApi(params?: ReportFilterParams): Promise<ApiResponse<DepartmentAttendanceReportItem[]>> {
  const response = await apiClient.get("/reports/department-attendance", { params });
  return response.data;
}
