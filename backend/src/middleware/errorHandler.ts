import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../utils/AppError";
import { handlePrismaError } from "../utils/prismaErrors";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    const message = err.issues.map((e: { message: string }) => e.message).join(", ");
    res.status(400).json({ success: false, message });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }

  const prismaError = handlePrismaError(err);
  if (prismaError.statusCode !== 500 || !(err instanceof Error)) {
    res.status(prismaError.statusCode).json({ success: false, message: prismaError.message });
    return;
  }

  console.error("Unexpected error:", err instanceof Error ? err.message : err);
  res.status(500).json({ success: false, message: "An unexpected error occurred." });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ success: false, message: "Route not found." });
}
