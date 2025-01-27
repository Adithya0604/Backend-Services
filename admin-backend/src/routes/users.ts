import express, { Router } from "express";
import { getUsers, getUser, deleteUser } from "../controllers/userController";
import { auth } from "../middleware/auth";
import { validateRequest } from "../middleware/validate";

const router: Router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Define routes with proper typing
router.get("/", getUsers as express.RequestHandler);
router.get("/:id", getUser as express.RequestHandler);
router.delete("/:id", deleteUser as express.RequestHandler);

export default router;