import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import { AppError } from "../utils/AppError";
import { signToken } from "../utils/jwt";

export async function loginAdmin(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const admin = await prisma.admin.findUnique({
    where: { email: normalizedEmail },
  });

  if (!admin) {
    throw new AppError("Invalid email or password.", 401);
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    throw new AppError("Invalid email or password.", 401);
  }

  const token = signToken({ adminId: admin.id, email: admin.email });
  return { token, admin: { id: admin.id, email: admin.email } };
}

export async function getAdminById(id: string) {
  const admin = await prisma.admin.findUnique({
    where: { id },
    select: { id: true, email: true },
  });
  if (!admin) {
    throw new AppError("Admin not found.", 404);
  }
  return admin;
}

export async function seedAdminIfNeeded() {
  const email = process.env.ADMIN_EMAIL || "admin@hotel.com";
  const password = process.env.ADMIN_PASSWORD || "Admin@123456";

  const normalizedEmail = email.trim().toLowerCase();
  const existing = await prisma.admin.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    return existing;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  return prisma.admin.create({
    data: { email: normalizedEmail, passwordHash },
  });
}
