const Document = require("../models/document");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
// const { parseDocument } = require("../utils/documentParser");

// Configure multer to use disk storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const uploadDir = path.join(__dirname, "../uploads");
		// Ensure the uploads directory exists
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir, { recursive: true });
		}
		cb(null, uploadDir); // Specify the directory where files will be stored
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(
			null,
			file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
		); // Generate a unique filename
	},
});

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 2 * 1024 * 1024, // Limit file size to 2 MB
	},
	fileFilter: (req, file, cb) => {
		// Allow only PDF files
		if (!file.originalname.match(/\.(pdf)$/)) {
			return cb(new Error("Only PDF files are allowed!"));
		}
		cb(null, true);
	},
}).single("file"); // Single file upload

const uploadDocument = async (req, res) => {
	try {
		upload(req, res, async (err) => {
			if (err) {
				return res.status(400).json({ message: err.message });
			}

			if (!req.file) {
				return res.status(400).json({ message: "No file uploaded" });
			}

			console.log("Request Body:", req.body);

			// Extract file details
			const { originalname, size, path: filePath, mimetype } = req.file;
			const { title, author, position } = req.body;
			const fileType = originalname.split(".").pop().toLowerCase(); // Get file extension

			// Create a new document entry and save to DB
			const newDocument = await Document.create({
				title,
				author,
				position,
				fileType: mimetype.split("/")[1], // Extract file type (e.g., "pdf")
				fileSize: size,
			});

			// Optionally delete the file from disk after processing
			// fs.unlinkSync(filePath);

			res.status(201).json({
				id: newDocument._id,
				message: "Document uploaded successfully",
			});
		});
	} catch (error) {
		console.error("Error uploading document:", error);
		res.status(500).json({ message: "Server error" });
	}
};

const getDocument = async (req, res) => {
	try {
		const { id } = req.params; // Get the document ID from the request parameters

		// Find the document in the database
		const document = await Document.findById(id);

		if (!document) {
			return res.status(404).json({ message: "Document not found" });
		}

		// If the document is stored on disk, send the file
		const filePath = path.join(__dirname, "../uploads", document.title);
		if (fs.existsSync(filePath)) {
			return res.sendFile(filePath);
		}
	} catch (error) {
		console.error("Error fetching document:", error.message);
		res.status(500).json({ message: "Server error" });
	}
};

module.exports = { uploadDocument, getDocument };
