import { z } from "zod";

export const registerSchema = z.object({
	username: z.string().min(3, "Username must be at least 3 characters"),
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(1, "Password is required"),
});

export const createRoomSchema = z.object({
	name: z.string().min(1, "Room name is required"),
	isGroup: z.boolean().optional(),
	memberIds: z.array(z.string().uuid()).optional(),
});

export const sendMessageSchema = z.object({
	content: z.string().min(1, "Message cannot be empty"),
	roomId: z.string().uuid("Invalid room ID"),
	type: z.enum(["TEXT", "IMAGE", "FILE", "GIF"]).default("TEXT"),
});
