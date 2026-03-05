import dotenv from "dotenv";
dotenv.config();
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { initSocket } from "./sockets/chat.socket.js";

const PORT = process.env.PORT || 8080;

const server = http.createServer(app);

export const io = new Server(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

initSocket(io);

server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
