import { Router } from "express";
import {
  createSlot,
  deleteSlot,
  getSlots,
  seedSlots,
  updateSlot
} from "../controllers/slotController.js";
import { authenticate, authorize } from "../middleware/auth.js";

const router = Router();

router.use(authenticate);
router.get("/", getSlots);
router.post("/", authorize("admin"), createSlot);
router.post("/seed", authorize("admin"), seedSlots);
router.put("/:id", authorize("admin"), updateSlot);
router.delete("/:id", authorize("admin"), deleteSlot);

export default router;