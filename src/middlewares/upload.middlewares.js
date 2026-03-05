import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: "arkthread",
		allowed_formats: ["jpg", "jpeg", "png", "gif", "pdf", "doc", "docx"],
		resource_type: "auto",
	},
});

const upload = multer({ storage, limits: { fileSize: 25 * 1024 * 1024 } });

export default upload;
