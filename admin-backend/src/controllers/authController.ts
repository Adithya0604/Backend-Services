import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Admin } from "../models/admin";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET!, {
      expiresIn: "24h",
    });

    res.json({ admin, token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
};
