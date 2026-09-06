import { Router } from "express";
import {
  activeParking,
  history,
  vehicleEntry,
  vehicleExit
} from "../controllers/parkingController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);
router.post("/entry", vehicleEntry);
router.post("/exit", vehicleExit);
router.get("/active", activeParking);
router.get("/history", history);

export default router;
