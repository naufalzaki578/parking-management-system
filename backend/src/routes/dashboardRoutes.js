import { Router } from "express";
import { statistics } from "../controllers/dashboardController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/statistics", authenticate, statistics);

export default router;
