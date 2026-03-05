import express from "express";
import { uploadFile } from "../controllers/upload.controllers.js";
import upload from "../middlewares/upload.middlewares.js";
import authMiddleware from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/:id/upload", authMiddleware, upload.single("file"), uploadFile);

export default router;
