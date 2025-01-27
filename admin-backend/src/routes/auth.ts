import express from "express";
import { login } from "../controllers/authController";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/login",
  [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

export default router;
