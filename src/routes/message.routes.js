import { Router } from "express";
import { getMessagesByRoomId } from "../controllers/messages.controllers.js";

const router = Router();

router.get("/rooms/:id/messages", getMessagesByRoomId);

export default router;
