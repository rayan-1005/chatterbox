import { io } from "socket.io-client";

const socket = io("http://localhost:8080", {
	auth: {
		token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4MmE3Y2I5Mi1iNDdhLTQzMDktOTRiYS01YzQxYjFhZDAwZTIiLCJpYXQiOjE3NzI3NDg4MTEsImV4cCI6MTc3Mjc0OTcxMX0.J_c5mZhyamvWUyGA-MnKvCkVeE2_keJjPxvtO6tmgEM",
	},
});

socket.on("connect", () => {
	console.log("Connected!", socket.id);

	socket.emit("joinRoom", "79a0dc00-825e-444b-a9b0-7dff49515f71");

	socket.emit("sendMessage", {
		roomId: "79a0dc00-825e-444b-a9b0-7dff49515f71",
		content: "Hello Senbonzakura!",
		type: "TEXT",
	});
});

socket.on("newMessage", (msg) => {
	console.log("Received:", msg);
});

socket.on("connect_error", (err) => {
	console.error("Connection error:", err.message);
});
