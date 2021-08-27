import { Router } from "express";
import debateController from "../controllers/debateController";

const router = Router();

router.get("/", debateController.getDebates);
router.get("/:id", debateController.getDebateById);

export default router;