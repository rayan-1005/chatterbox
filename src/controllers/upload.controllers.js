import prisma from "../config/prisma.js";
import { io } from "../server.js";

export const uploadFile = async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ message: "File not found" });
		}
		const file = req.file.path;

		const message = await prisma.message.create({
			data: {
				content: file,
				type: "FILE",
				fileUrl: file,
				roomId: req.body.roomId,
				senderId: req.userId,
			},
			include: {
				sender: {
					select: {
						id: true,
						username: true,
						avatar: true,
					},
				},
			},
		});

		io.to(req.body.roomId).emit("receivedMessage", message);

		res.status(200).json(message);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};
