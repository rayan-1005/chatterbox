import {
	createRoom,
	getMyRooms,
	getRoomById,
	leaveRoom,
	addMembersToRoom,
} from "../controllers/room.controllers.js";
import authMiddleware from "../middlewares/auth.middlewares.js";
import validate from "../middlewares/validate.middlewares.js";
import { createRoomSchema } from "../utils/validators.js";
import express from "express";

const router = express.Router();

router.post("/", authMiddleware, validate(createRoomSchema), createRoom);
router.get("/", authMiddleware, getMyRooms);
router.get("/:id", authMiddleware, getRoomById);
router.delete("/:id/leave", authMiddleware, leaveRoom);
router.post("/:id/members", authMiddleware, addMembersToRoom);

export default router;
