import { Request, Response } from "express";
import mongoose from "mongoose";
import { User } from "../models/user";
import { Audit } from "../models/audit";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find(
      { isDeleted: { $ne: true } },
      { password: 0 }
    );
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid user ID format" });
      return;
    }

    const user = await User.findOne(
      { _id: id, isDeleted: { $ne: true } },
      { password: 0 }
    );

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid user ID format" });
      return;
    }

    // Check if admin has delete permissions
    if (req.admin?.role !== "super_admin") {
      res.status(403).json({ message: "Insufficient permissions" });
      return;
    }

    const user = await User.findOne({ _id: id, isDeleted: { $ne: true } });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Soft delete
    await User.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date(),
    });

    // Create audit log
    await Audit.create({
      action: "DELETE_USER",
      entityType: "user",
      entityId: user._id,
      adminId: req.admin._id,
      details: {
        deletedUser: user.email,
        timestamp: new Date(),
      },
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};
