const { Schema, model } = require("mongoose");

const candidateSchema = new Schema({
	admission_number: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	position_title: {
		type: String,
		required: true,
	},
	candidacy_status: {
		type: String,
		required: true,
		enum: ["Nominated", "Qualified", "Disqualified", "Pending"],
		default: "Pending",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	telephone: {
		type: String,
		required: true,
		unique: true,
	},
});

module.exports = model("Candidate", candidateSchema);
