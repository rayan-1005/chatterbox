import express from "express";
import { searchUsers } from "../controllers/user.controllers.js";
import authMiddleware from "../middlewares/auth.middlewares.js";

const router = express.Router();
router.get("/search", authMiddleware, searchUsers);
export default router;
