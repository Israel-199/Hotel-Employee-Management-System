import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Valid email is required."),
  password: z.string().min(1, "Password is required."),
});

export const departmentSchema = z.object({
  name: z.string().min(1, "Department name is required.").max(100),
  description: z.string().max(500).optional().nullable(),
});

export const roleSchema = z.object({
  name: z.string().min(1, "Role name is required.").max(100),
  description: z.string().max(500).optional().nullable(),
});

export const shiftSchema = z.object({
  name: z.string().min(1, "Shift name is required.").max(100),
  startTime: z.string().min(1, "Start time is required."),
  endTime: z.string().min(1, "End time is required."),
  description: z.string().max(500).optional().nullable(),
});

export const employeeStatusEnum = z.enum(["ACTIVE", "INACTIVE", "ON_LEAVE", "TERMINATED"]);

export const employeeSchema = z.object({
  employeeNumber: z.string().min(1, "Employee number is required.").max(50),
  firstName: z.string().min(1, "First name is required.").max(100),
  lastName: z.string().min(1, "Last name is required.").max(100),
  email: z.string().email("Valid email is required."),
  phone: z.string().max(20).optional().nullable(),
  hireDate: z.string().min(1, "Hire date is required."),
  departmentId: z.string().min(1, "Department is required."),
  roleId: z.string().min(1, "Role is required."),
  shiftId: z.string().min(1, "Shift is required."),
  status: employeeStatusEnum.default("ACTIVE"),
});

export const attendanceStatusEnum = z.enum(["PRESENT", "ABSENT", "LATE", "LEAVE"]);

export const attendanceSchema = z.object({
  employeeId: z.string().min(1, "Employee is required."),
  date: z.string().min(1, "Date is required."),
  status: attendanceStatusEnum,
  checkIn: z.string().optional().nullable(),
  checkOut: z.string().optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
});

export const reportQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  departmentId: z.string().optional(),
});
