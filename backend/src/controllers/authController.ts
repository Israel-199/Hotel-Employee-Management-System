import { Request, Response, NextFunction } from "express";
import { loginAdmin, getAdminById } from "../services/authService";
import { loginSchema } from "../utils/validation";
import { AUTH_COOKIE_NAME, getCookieOptions } from "../utils/jwt";
import { AuthRequest } from "../middleware/auth";

export async function loginHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const result = await loginAdmin(email, password);

    res.cookie(AUTH_COOKIE_NAME, result.token, getCookieOptions());
    res.status(200).json({
      success: true,
      data: {
        admin: result.admin,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function meHandler(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.admin) {
      res.status(401).json({ success: false, message: "Not authenticated." });
      return;
    }
    const admin = await getAdminById(req.admin.id);
    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    next(error);
  }
}

export async function logoutHandler(_req: Request, res: Response): Promise<void> {
  res.clearCookie(AUTH_COOKIE_NAME, getCookieOptions());
  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
}
