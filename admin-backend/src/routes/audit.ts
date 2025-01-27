import express from "express";
import { auth } from "../middleware/auth";
import { getAuditNotes, getAuditLogs } from "../controllers/auditController";

const router = express.Router();

router.use(auth);

router.get("/notes", getAuditNotes);
router.get("/logs", getAuditLogs);

export default router;
