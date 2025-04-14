const jwt = require("jsonwebtoken");
const Vote = require("../models/vote");
const Candidate = require("../models/candidates");
const requestIp = require("request-ip");
const axios = require("axios");
const { SECRET_KEY, RECAPTCHA_SECRET_KEY } = process.env;
const IPData = require("ipdata").default;

// Initialize ipdata client with your API key
const ipdata = new IPData(
	"9f24fd93c1fa9770519afe0a67e759d723396f42f4fe15281b78759b"
);

const authenticate = (req, res, next) => {
	try {
		const token = req.header("Authorization").replace("Bearer ", "");
		const decoded = jwt.verify(token, SECRET_KEY);
		req.user = decoded;
		next();
	} catch (error) {
		res.status(401).json({ message: "Authentication failed" });
	}
};

const verifyCaptcha = async (captchaToken) => {
	if (!captchaToken) {
		return { message: "CAPTCHA token is missing." };
	}

	try {
		const response = await axios.post(
			`https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${captchaToken}`
		);

		const { success, score, action } = response.data;

		console.log(success, score, action);
		if (!success || score < 0.5 || action !== "voteAction") {
			return { message: "reCAPTCHA verification failed." };
		}

		if (response.data.success) {
			next();
		} else {
			return { message: "CAPTCHA verification failed." };
		}
	} catch (error) {
		console.error("Error verifying CAPTCHA:", error);
		return { message: "Error verifying CAPTCHA." };
	}
};

// Vote submission endpoint
const castVote = async (req, res) => {
	const ip_address = requestIp.getClientIp(req);

	const { candidate_ids, requiredVotes, captchaToken } = req.body; // Include captchaToken in the request body
	const user_id = req.user.id;

	try {
		// Step 1: Validate reCAPTCHA token
		const captchaResponse = verifyCaptcha(captchaToken);
		if (captchaResponse.message) {
			return res.status(400).json({ message: captchaResponse.message });
		}

		// Step 2: Proceed with voting logic
		// Check if user has already voted
		const existingVote = await Vote.findOne({ user_id });
		if (existingVote) {
			return res.status(400).json({ message: "You have already voted" });
		}

		// Check if the IP address has already been used for voting
		const existingVoteByIp = await Vote.findOne({ ip_address });
		if (existingVoteByIp) {
			return res
				.status(400)
				.json({ message: "You have already voted from this IP address" });
		}

		// Check if the number of selected candidates matches the required number of votes
		if (candidate_ids.length !== requiredVotes) {
			return res.status(400).json({
				message: `You must vote for exactly ${requiredVotes} candidates.`,
			});
		}

		// Check if all candidates exist
		for (const candidate_id of candidate_ids) {
			const candidate = await Candidate.findById(candidate_id);
			if (!candidate) {
				return res.status(404).json({
					message: `Candidate not found: ${candidate_id}`,
				});
			}
		}

		// Save the vote
		const vote = new Vote({ user_id, candidate_ids, ip_address });
		await vote.save();

		res.status(201).json({ message: "Vote submitted successfully" });
	} catch (error) {
		console.error("Error submitting vote:", error);
		res.status(500).json({ message: "Server error" });
	}
};

const getVoteStatus = async (req, res) => {
	const { user_id } = req.params;

	try {
		// Find vote casted by user admission_number
		const vote = await Vote.findOne({ user_id });
		console.log(vote);

		vote !== null ? res.status(200).json(true) : res.status(200).json(false);
	} catch (error) {
		console.log("Error:", error.message);
		res.status(500).json({ message: "Server error" });
	}
};

const checkIpForThreats = async (req, res, next) => {
	try {
		// Extract the IP address from the request
		const ip_address = requestIp.getClientIp(req);
		console.log("Extracted IP Address:", ip_address);

		// Skip IP validation for reserved/local IPs during development
		if (
			ip_address === "127.0.0.1" ||
			ip_address === "::1" ||
			ip_address === "::ffff:127.0.0.1"
		) {
			console.log("Local/reserved IP detected. Skipping IP validation.");
			return next(); // Skip IP validation for localhost
		}

		// Validate the IP address
		if (!ip_address || typeof ip_address !== "string") {
			return res.status(400).json({
				message: "Unable to determine your IP address. Please try again.",
			});
		}

		const ipDetails = await ipdata.lookup(ip_address);

		// Check if the response indicates an error
		if (ipDetails.status === 400 || !ipDetails.threat) {
			console.error(
				"Invalid response from ipdata:",
				ipDetails.message || "Unknown error"
			);
			return res.status(500).json({ message: "Failed to verify IP address." });
		}

		// Check for threats
		if (ipDetails.threat.is_threat) {
			return res.status(400).json({
				message:
					"Suspicious activity detected (VPN/Proxy/TOR). Voting is not allowed.",
			});
		}
		next();
	} catch (error) {
		console.error("Error fetching ipdata:", error.message);
		return res.status(500).json({ message: "Failed to verify IP address." });
	}
};

//TODO: implement getting votes for specific year

module.exports = {
	authenticate,
	castVote,
	getVoteStatus,
	checkIpForThreats,
};
