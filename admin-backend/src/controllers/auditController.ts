import { Request, Response } from "express";
import axios from "axios";
import { Audit } from "../models/audit";

// Enhanced audit controller with proper error handling
export const getAuditNotes = async (req: Request, res: Response) => {
  try {
    const response = await axios.get(
      `${process.env.USER_BACKEND_URL}/admin/notes`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CROSS_SERVICE_TOKEN}`,
        },
      }
    );

    if (response.status === 200) {
      // Only create audit log on successful access
      await Audit.create({
        action: "VIEW_NOTES",
        entityType: "note",
        adminId: req.admin._id,
        details: {
          accessTimestamp: new Date(),
          success: true,
        },
      });
      res.json(response.data);
    } else {
      throw new Error("Failed to fetch notes");
    }
  } catch (error) {
    // Log failed attempts too
    await Audit.create({
      action: "VIEW_NOTES_FAILED",
      entityType: "note",
      adminId: req.admin._id,
      details: {
        accessTimestamp: new Date(),
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
    });
    res.status(500).json({ message: "Unable to process request" });
  }
};

// Enhanced user controller with proper authorization
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Check if admin has delete permissions
    if (req.admin.role !== "super_admin") {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Soft delete instead of hard delete
    await User.findByIdAndUpdate(id, {
      isDeleted: true,
      deletedAt: new Date(),
    });

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
    res.status(500).json({ message: "Unable to process request" });
  }
};

// Enhanced authentication middleware with rate limiting
import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: { message: "Too many login attempts, please try again later" },
});

// Enhanced JWT verification
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT secret not configured");
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    const admin = await Admin.findOne({
      _id: decoded.adminId,
      isActive: true, // Only allow active admins
    });

    if (!admin) {
      return res.status(401).json({ message: "Authentication required" });
    }

    req.admin = admin;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Session expired" });
    }
    res.status(401).json({ message: "Authentication required" });
  }
};
