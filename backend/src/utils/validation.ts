import { z } from "zod";

const timeRegex = /^(?:(?:0?[1-9]|1[0-2]):[0-5][0-9]\s?(?:AM|PM|am|pm)|(?:[01]\d|2[0-3]):[0-5]\d)$/;
const nameRegex = /^[a-zA-Z\s\-\.'&(),/]+$/;
const phoneRegex = /^(?:\+251|0)[79]\d{8}$/;

const nameSchema = (field: string) =>
  z
    .string()
    .trim()
    .min(1, `${field} cannot be empty.`)
    .max(100, `${field} cannot exceed 100 characters.`)
    .regex(nameRegex, `${field} contains invalid characters.`);

const dateSchema = (field: string) =>
  z
    .string()
    .trim()
    .min(1, `${field} is required.`)
    .refine((val) => !isNaN(Date.parse(val)), {
      message: `${field} must be a valid date string (e.g. YYYY-MM-DD).`,
    });

const timeSchema = (field: string) =>
  z
    .string()
    .trim()
    .regex(timeRegex, `${field} must be in 12-hour AM/PM format (e.g. 07:00AM or 12:00PM).`);

export const loginSchema = z.object({
  email: z.string().trim().email("Valid email address is required.").max(255),
  password: z.string().min(1, "Password is required."),
});

export const departmentSchema = z.object({
  name: nameSchema("Department name"),
  description: z.string().trim().max(500, "Description cannot exceed 500 characters.").optional().nullable(),
});

export const roleSchema = z.object({
  name: nameSchema("Role name"),
  description: z.string().trim().max(500, "Description cannot exceed 500 characters.").optional().nullable(),
});

export const shiftSchema = z
  .object({
    name: nameSchema("Shift name"),
    startTime: timeSchema("Start time"),
    endTime: timeSchema("End time"),
    description: z.string().trim().max(500, "Description cannot exceed 500 characters.").optional().nullable(),
  })
  .refine((data) => data.startTime !== data.endTime, {
    message: "Start time and end time cannot be identical.",
    path: ["endTime"],
  });

export const employeeStatusEnum = z.enum(["ACTIVE", "INACTIVE", "ON_LEAVE", "TERMINATED"]);

export const employeeSchema = z.object({
  employeeNumber: z
    .string()
    .trim()
    .min(1, "Employee number cannot be empty.")
    .max(50, "Employee number cannot exceed 50 characters.")
    .regex(/^[a-zA-Z0-9\-_]+$/, "Employee number must contain only letters, numbers, hyphens, or underscores."),
  firstName: nameSchema("First name"),
  lastName: nameSchema("Last name"),
  email: z.string().trim().email("Valid email address is required.").max(255),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Phone number must be a valid Ethiopian phone number (e.g. +251911234567 or 0911234567).")
    .optional()
    .nullable()
    .or(z.literal("")),
  hireDate: dateSchema("Hire date"),
  departmentId: z.string().trim().min(1, "Department is required."),
  roleId: z.string().trim().min(1, "Role is required."),
  shiftId: z.string().trim().min(1, "Shift is required."),
  status: employeeStatusEnum.default("ACTIVE"),
});

export const attendanceStatusEnum = z.enum(["PRESENT", "ABSENT", "LATE", "LEAVE"]);

export const attendanceSchema = z.object({
  employeeId: z.string().trim().min(1, "Employee is required."),
  date: dateSchema("Date"),
  status: attendanceStatusEnum,
  checkIn: z
    .string()
    .trim()
    .refine((val) => !val || !isNaN(Date.parse(val)), { message: "Invalid check-in date/time format." })
    .optional()
    .nullable(),
  checkOut: z
    .string()
    .trim()
    .refine((val) => !val || !isNaN(Date.parse(val)), { message: "Invalid check-out date/time format." })
    .optional()
    .nullable(),
  notes: z.string().trim().max(500, "Notes cannot exceed 500 characters.").optional().nullable(),
});

export const reportQuerySchema = z
  .object({
    startDate: z
      .string()
      .trim()
      .refine((val) => !val || !isNaN(Date.parse(val)), { message: "Invalid start date format." })
      .optional(),
    endDate: z
      .string()
      .trim()
      .refine((val) => !val || !isNaN(Date.parse(val)), { message: "Invalid end date format." })
      .optional(),
    departmentId: z.string().trim().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return new Date(data.startDate) <= new Date(data.endDate);
      }
      return true;
    },
    {
      message: "Start date must be less than or equal to end date.",
      path: ["startDate"],
    }
  );
