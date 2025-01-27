import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";
import auditRoutes from "./routes/audit";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/audit", auditRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Admin backend server running on port ${PORT}`);
});
