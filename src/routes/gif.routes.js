import express from "express";
import { searchGIF } from "../controllers/searchGIF.controllers.js";
import authMiddleware from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.get("/search", authMiddleware, searchGIF);

export default router;
