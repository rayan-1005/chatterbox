import prisma from "../config/prisma.js";
import { verifyAccessToken } from "../utils/jwt.js";
import redis from "../config/redis.js";

export const initSocket = (io) => {
	io.use((socket, next) => {
		const token =
			socket.handshake.auth.token || socket.handshake.headers.token;
		if (!token) {
			return next(new Error("Unauthorized"));
		}
		try {
			const decoded = verifyAccessToken(token);
			socket.userId = decoded.userId;
			next();
		} catch (error) {
			next(new Error("Invalid token"));
		}
	});
	io.on("connection", async (socket) => {
		await redis.set(`user:online:${socket.userId}`, "true");
		console.log(`User connected: ${socket.userId}`);

		socket.on("joinRoom", (roomId) => {
			console.log(`User joined room: ${roomId}`);
			socket.join(roomId);
		});

		socket.on("sendMessage", async (data) => {
			console.log("Received message:", data);
			try {
				const { content, roomId, type } = data;
				const msg = await prisma.message.create({
					data: {
						content,
						type,
						roomId,
						senderId: socket.userId,
					},
				});
				io.to(data.roomId).emit("receivedMessage", msg);
			} catch (error) {
				console.error(error);
			}
		});

		socket.on("typing", ({ roomId, isTyping }) => {
			socket
				.to(roomId)
				.emit("typing", { userId: socket.userId, isTyping });
		});

		socket.on("disconnect", async () => {
			console.log("User disconnected");
			await redis.del(`user:online:${socket.userId}`);
		});
	});
};
