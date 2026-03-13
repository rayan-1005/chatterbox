import prisma from "../config/prisma.js";

export const searchUsers = async (req, res) => {
	try {
		const { q } = req.query;
		if (!q) return res.status(400).json({ error: "Query is required" });

		const users = await prisma.user.findMany({
			where: {
				username: { contains: q, mode: "insensitive" },
				NOT: { id: req.userId }, // exclude self
			},
			select: { id: true, username: true, avatar: true },
			take: 10,
		});

		res.status(200).json(users);
	} catch (error) {
		res.status(500).json({ error: "Search failed" });
	}
};
