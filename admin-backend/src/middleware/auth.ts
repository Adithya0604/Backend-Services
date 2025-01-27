import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Admin } from "../models/admin";

interface JwtPayload {
  adminId: string;
}

declare global {
  namespace Express {
    interface Request {
      admin?: any;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const admin = await Admin.findById(decoded.adminId);

    if (!admin) {
      throw new Error();
    }

    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).json({ message: "Admin authentication required" });
  }
};
