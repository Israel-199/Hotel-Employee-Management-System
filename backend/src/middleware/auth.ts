import { Request, Response, NextFunction } from "express";
import { verifyToken, AUTH_COOKIE_NAME } from "../utils/jwt";

export interface AuthRequest extends Request {
  admin?: { id: string; email: string };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const token = req.cookies?.[AUTH_COOKIE_NAME];

  if (!token) {
    res.status(401).json({ success: false, message: "Authentication required." });
    return;
  }

  try {
    const payload = verifyToken(token);
    req.admin = { id: payload.adminId, email: payload.email };
    next();
  } catch {
    res.clearCookie(AUTH_COOKIE_NAME);
    res.status(401).json({ success: false, message: "Invalid or expired session." });
  }
}

export function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction): void {
  const token = req.cookies?.[AUTH_COOKIE_NAME];
  if (token) {
    try {
      const payload = verifyToken(token);
      req.admin = { id: payload.adminId, email: payload.email };
    } catch {
    }
  }
  next();
}
