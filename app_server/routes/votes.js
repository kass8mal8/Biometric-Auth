const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const {
	authenticate,
	castVote,
	getVoteStatus,
	checkIpForThreats,
} = require("../controllers/vote");
const rateLimit = require("express-rate-limit");

const voteLimiter = rateLimit({
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 3, // Limit each IP to 3 requests per windowMs
	message: "You have already voted.",
});

// Middleware to check for validation errors
const validate = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ error: errors.errors[0].msg });
	}
	next();
};

// Vote submission endpoint
router.post(
	"/vote",
	[
		authenticate,
		voteLimiter,
		checkIpForThreats,
		check("candidate_ids")
			.isArray()
			.withMessage("Candidate IDs should be an array"),
		check("candidate_ids.*").isMongoId().withMessage("Invalid candidate ID"),
	],
	castVote
);

// Get vote status endpoint
router.get(
	"/status/:user_id",
	[check("user_id").isMongoId().withMessage("Invalid user ID"), validate],
	getVoteStatus
);

module.exports = router;
