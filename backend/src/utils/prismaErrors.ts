import { Prisma } from "@prisma/client";
import { AppError } from "./AppError";

export function handlePrismaError(error: unknown): AppError {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": {
        const target = (error.meta?.target as string[]) || [];
        const field = target[0] || "field";
        if (field.includes("employeeNumber")) {
          return new AppError("Employee number already exists.", 409);
        }
        if (field.includes("email")) {
          return new AppError("Employee email already exists.", 409);
        }
        if (field.includes("name")) {
          return new AppError("Name already exists.", 409);
        }
        if (target.some((t) => t.includes("employeeId") && t.includes("date"))) {
          return new AppError(
            "Attendance already exists for this employee on this date.",
            409
          );
        }
        return new AppError("A record with this value already exists.", 409);
      }
      case "P2003":
        return new AppError("Related record not found.", 400);
      case "P2025":
        return new AppError("Record not found.", 404);
      default:
        return new AppError("Database operation failed.", 500);
    }
  }
  if (error instanceof AppError) {
    return error;
  }
  return new AppError("An unexpected error occurred.", 500);
}

export function parseDateOnly(value: string): Date {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new AppError("Invalid date format.", 400);
  }
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

const ETHIOPIA_OFFSET_MS = 3 * 60 * 60 * 1000;

export function startOfTodayUTC(): Date {
  const eatNow = new Date(Date.now() + ETHIOPIA_OFFSET_MS);
  return new Date(Date.UTC(eatNow.getUTCFullYear(), eatNow.getUTCMonth(), eatNow.getUTCDate()) - ETHIOPIA_OFFSET_MS);
}

export function endOfTodayUTC(): Date {
  const start = startOfTodayUTC();
  return new Date(start.getTime() + 24 * 60 * 60 * 1000);
}
