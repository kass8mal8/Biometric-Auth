const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VoteSchema = new Schema({
	user_id: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
		unique: true, // Ensure that each user can vote only once
	},
	candidate_ids: [
		{
			type: Schema.Types.ObjectId,
			ref: "Candidate",
			required: true,
		},
	],
	ip_address: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Vote", VoteSchema);
