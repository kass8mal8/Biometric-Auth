const { Schema, model } = require("mongoose");

// Define the schema for a document
const documentSchema = new Schema({
	title: {
		type: String,
		required: true, // Title is mandatory
		trim: true, // Remove whitespace from both ends
		maxlength: 255, // Limit the length of the title
	},
	author: {
		type: Schema.Types.ObjectId, // Reference to the User model
		ref: "User", // Relationship with the User model
		required: true, // Every document must have an author
	},
	position: {
		type: Schema.Types.ObjectId, // Reference to the User model
		ref: "Position", // Relationship with the User model
		required: true,
	},
	fileType: {
		type: String,
		enum: ["pdf"], // Restrict file types to PDF or Word
		required: true, // File type is mandatory
	},
	fileSize: {
		type: Number, // Size of the file in bytes
		required: true, // File size is mandatory
	},
	createdAt: {
		type: Date,
		default: Date.now, // Automatically set the creation date
	},
});

// Create and export the Document model
module.exports = model("Document", documentSchema);
