import { Router } from "express";
import usersController from "../controllers/usersController";

const router = Router();

router.get("/", usersController.getUsers);
router.get("/:id", usersController.getUserById);

export default router;