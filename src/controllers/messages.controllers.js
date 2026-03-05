import prisma from "../config/prisma.js";

const getMessagesByRoomId = async (req, res) => {
	try {
		const roomId = req.params.id;

		const { cursor, limit = 20 } = req.query;
		const messages = await prisma.message.findMany({
			where: { roomId },
			take: parseInt(limit),
			skip: cursor ? 1 : 0,
			cursor: cursor ? { id: cursor } : undefined,
			orderBy: { createdAt: "asc" },
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
		const nextCursor =
			messages.length < parseInt(limit)
				? null
				: messages[messages.length - 1].id;
		res.json({ messages, nextCursor });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to fetch messages" });
	}
};

export { getMessagesByRoomId };
