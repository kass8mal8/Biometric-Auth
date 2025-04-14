const { Schema, model } = require("mongoose");

const PositionSchema = new Schema({
	createdAt: {
		type: Date,
		default: Date.now,
	},
	status: {
		type: String,
		enum: ["vacant", "filled"],
		default: "vacant",
	},
	position_group: {
		type: String,
		required: true,
		enum: ["ECR", "Congress", "Student Council"],
		default: "ECR",
	},
	total: {
		type: Number,
		required: true,
	},
	filled: {
		type: Number,
		required: true,
	},
});

module.exports = model("Position", PositionSchema);
