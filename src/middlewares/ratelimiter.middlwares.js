import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // max 100 requests per 15 mins
	message: { error: "Too many requests, please try again later" },
});

export const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 10, // max 10 login attempts per 15 mins
	message: { error: "Too many auth attempts, please try again later" },
});
