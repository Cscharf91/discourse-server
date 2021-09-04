import { Router } from "express";
import usersController from "../controllers/usersController";

const router = Router();

router.get("/", usersController.getUsers);
router.get("/:id", usersController.getUserById);
router.post('/register', usersController.register);
router.post('/login', usersController.login);

export default router;