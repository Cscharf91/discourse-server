import { Router } from "express";
import debateController from "../controllers/debateController";
import verifyToken from "../middleware/verifyToken";

const router = Router();

router.post("/", debateController.addDebate);
router.get("/", debateController.getDebates);
router.get("/:id", debateController.getDebateById);

export default router;