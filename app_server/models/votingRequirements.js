const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requirementSchema = new Schema({
	position_title: {
		type: String,
		required: true,
	},
	faculty: {
		type: String,
		required: true,
	},
	year: {
		type: Number,
		required: true,
	},
	requiredVotes: {
		type: Number,
		required: true,
		min: 1,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Requirement", requirementSchema);
