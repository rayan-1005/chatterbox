import exress from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import roomRoutes from "./routes/room.routes.js";
import messageRoutes from "./routes/message.routes.js";
import gifRoutes from "./routes/gif.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import {
	globalLimiter,
	authLimiter,
} from "./middlewares/ratelimiter.middlwares.js";

import errorMiddleware from "./middlewares/error.middlewares.js";

const app = exress();

app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(exress.json());
app.use(cookieParser());
app.use(errorMiddleware);
app.use(globalLimiter);

app.use("/api/auth", authLimiter, authRoutes);

app.use("/api/rooms", roomRoutes);

app.use("/api/rooms", uploadRoutes);

app.use("/api", messageRoutes);

app.use("/api/gifs", gifRoutes);

app.get("/", (req, res) => {
	res.send("Hello World!");
});

export default app;
