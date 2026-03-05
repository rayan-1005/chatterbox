import prisma from "../config/prisma.js";

const createRoom = async (req, res) => {
	try {
		const { name, isGroup, memberIds = [] } = req.body;
		if (!name) {
			return res.status(400).json({ error: "Room name is required" });
		}

		const room = await prisma.room.create({
			data: {
				name,
				isGroup: isGroup ?? false,
				members: {
					create: [
						{ userId: req.userId },
						...memberIds.map((id) => ({ userId: id })),
					],
				},
			},
		});
		res.status(201).json(room);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to create room" });
	}
};

const getMyRooms = async (req, res) => {
	try {
		const userId = req.userId;
		const rooms = await prisma.room.findMany({
			where: {
				members: {
					some: { userId },
				},
			},
			include: {
				members: {
					include: {
						user: {
							select: { id: true, username: true, avatar: true },
						},
					},
				},
				messages: {
					orderBy: { createdAt: "desc" },
					take: 1,
				},
			},
		});
		res.status(200).json(rooms);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to fetch rooms" });
	}
};

const getRoomById = async (req, res) => {
	try {
		const roomId = req.params.id;
		const room = await prisma.room.findUnique({
			where: { id: roomId },
			include: {
				members: {
					some: { userId: req.userId },
					include: {
						user: {
							select: { id: true, username: true, avatar: true },
						},
					},
				},
			},
		});
		if (!room) {
			return res.status(404).json({ error: "Room not found" });
		}
		res.status(200).json(room);
	} catch (error) {
		console.error(error);
		res.status(404).json({ error: "Room not found" });
	}
};

const leaveRoom = async (req, res) => {
	try {
		const userId = req.userId;
		const roomId = req.params.id;
		if (!roomId) {
			return res.status(400).json({ error: "Room ID is required" });
		}
		await prisma.roomMember.delete({
			where: {
				userId_roomId: {
					userId,
					roomId,
				},
			},
		});
		res.status(200).json({ message: "Left room successfully" });
	} catch (error) {
		console.error(error);
		res.status(404).json({ error: "Failed to leave room" });
	}
};

const addMembersToRoom = async (req, res) => {
	try {
		const userId = req.userId;
		const roomId = req.params.id;
		const { memberIds = [] } = req.body;
		if (!roomId) {
			return res.status(400).json({ error: "Room ID is required" });
		}
		const room = await prisma.room.findUnique({
			where: { id: roomId },
			include: {
				members: {
					where: { userId },
				},
			},
		});
		if (!room) {
			return res.status(404).json({ error: "Room not found" });
		}
		if (room.members.length === 0) {
			return res
				.status(403)
				.json({ error: "You are not a member of this room" });
		}
		await prisma.roomMember.createMany({
			data: memberIds.map((id) => ({ userId: id, roomId })),
			skipDuplicates: true,
		});
		res.status(200).json({ message: "Members added successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to add members to room" });
	}
};

export { createRoom, getMyRooms, getRoomById, leaveRoom, addMembersToRoom };
