import { Router } from "express";
import {
	register,
	login,
	refreshToken,
	logout,
} from "../controllers/auth.controllers.js";
import validate from "../middlewares/validate.middlewares.js";
import { registerSchema, loginSchema } from "../utils/validators.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

export default router;
