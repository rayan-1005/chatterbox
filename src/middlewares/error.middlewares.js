import multer from "multer";

const errorMiddleware = (err, req, res, next) => {
	if (err instanceof multer.MulterError) {
		if (err.code === "LIMIT_FILE_SIZE") {
			return res
				.status(400)
				.json({ message: "File size exceeds the limit of 25MB" });
		}
		return res.status(400).json({ message: err.message });
	}
	console.error(err);
	res.status(500).json({ message: "Internal Server Error" });
};

export default errorMiddleware;
