import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";
import {
	generateAccessToken,
	generateRefreshToken,
	verifyRefreshToken,
} from "../utils/jwt.js";

export const register = async (req, res) => {
	try {
		const { username, email, password } = req.body;
		if (!username || !email || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}

		// Check if user already exists
		const existingUser = await prisma.user.findFirst({
			where: { OR: [{ email }, { username }] },
		});

		if (existingUser) {
			return res
				.status(400)
				.json({ message: "Email or username already taken" });
		}

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Create user
		const user = await prisma.user.create({
			data: { username, email, password: hashedPassword },
		});

		// Generate tokens
		const accessToken = generateAccessToken(user.id);
		const refreshToken = generateRefreshToken(user.id);
		const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
		await prisma.refreshToken.create({
			data: {
				tokenHash: hashedRefreshToken,
				userId: user.id,
				expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
			},
		});

		const cookieOptions = {
			httpOnly: true,
			sameSite: "strict",
			secure: process.env.NODE_ENV === "production",
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		};

		res.status(201)
			.cookie("refreshToken", refreshToken, cookieOptions)
			.json({
				message: "User registered successfully",
				accessToken,
				user: {
					id: user.id,
					username: user.username,
					email: user.email,
				},
			});
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) {
			return res
				.status(400)
				.json({ message: "Email and password are required" });
		}

		// Find user
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		// Check password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		// Generate tokens
		const accessToken = generateAccessToken(user.id);
		const refreshToken = generateRefreshToken(user.id);

		const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

		const cookieOptions = {
			httpOnly: true,
			sameSite: "strict",
			secure: process.env.NODE_ENV === "production",
			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
		};

		await prisma.refreshToken.deleteMany({ where: { userId: user.id } }); // Invalidate old refresh tokens

		await prisma.refreshToken.create({
			data: {
				tokenHash: hashedRefreshToken,
				userId: user.id,
				expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
			},
		});

		res.status(200)
			.cookie("refreshToken", refreshToken, cookieOptions)
			.json({
				message: "Login successful",
				accessToken,
				user: {
					id: user.id,
					username: user.username,
					email: user.email,
				},
			});
	} catch (error) {
		res.status(500).json({ message: "Internal server error" });
	}
};

export const refreshToken = async (req, res) => {
	try {
		const token = req.cookies.refreshToken;

		if (!token) {
			return res.status(401).json({ message: "Refresh token missing" });
		}

		const decoded = verifyRefreshToken(token);

		const sessions = await prisma.refreshToken.findMany({
			where: { userId: decoded.userId },
		});

		let matchedSession = null;

		for (const session of sessions) {
			const isMatch = await bcrypt.compare(token, session.tokenHash);
			if (isMatch) {
				matchedSession = session;
				break;
			}
		}

		if (!matchedSession) {
			return res.status(401).json({ message: "Invalid session" });
		}

		if (matchedSession.expiresAt < new Date()) {
			await prisma.refreshToken.delete({
				where: { id: matchedSession.id },
			});
			return res.status(401).json({ message: "Session expired" });
		}

		const newAccessToken = generateAccessToken(decoded.userId);
		const newRefreshToken = generateRefreshToken(decoded.userId);
		const newHashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);

		const cookieOptions = {
			httpOnly: true,
			sameSite: "strict",
			secure: process.env.NODE_ENV === "production",
			maxAge: 7 * 24 * 60 * 60 * 1000,
		};

		await prisma.$transaction(async (tx) => {
			await tx.refreshToken.delete({
				where: { id: matchedSession.id },
			});

			await tx.refreshToken.create({
				data: {
					tokenHash: newHashedRefreshToken,
					userId: decoded.userId,
					expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
				},
			});
		});

		res.cookie("refreshToken", newRefreshToken, cookieOptions)
			.status(200)
			.json({
				message: "Access token refreshed successfully",
				accessToken: newAccessToken,
			});
	} catch (error) {
		return res
			.status(401)
			.json({ message: "Invalid or expired refresh token" });
	}
};

export const logout = async (req, res) => {
	try {
		const token = req.cookies.refreshToken;
		if (!token) {
			return res.status(401).json({ message: "Refresh token missing" });
		}

		const decoded = verifyRefreshToken(token);

		const sessions = await prisma.refreshToken.findMany({
			where: { userId: decoded.userId },
		});

		let matchedSession = null;

		for (const session of sessions) {
			const isMatch = await bcrypt.compare(token, session.tokenHash);
			if (isMatch) {
				matchedSession = session;
				break;
			}
		}

		if (!matchedSession) {
			return res.status(401).json({ message: "Invalid session" });
		}

		await prisma.refreshToken.delete({
			where: { id: matchedSession.id },
		});

		res.clearCookie("refreshToken")
			.status(200)
			.json({ message: "Logged out successfully" });
	} catch (error) {
		console.error(error);
		res.status(401).json({ message: "Internal server error" });
	}
};
