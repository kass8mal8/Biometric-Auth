const Requirements = require("../models/votingRequirements");

const getRequirements = async (req, res) => {
	const { faculty } = req.params;

	try {
		const requirements = await Requirements.find({ faculty });
		console.log(requirements);
		res.status(200).json(requirements);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const addRequirements = async (req, res) => {
	const { faculty, year, position_title, required_votes } = req.body;

	try {
		await Requirements.create({
			faculty,
			year,
			position_title,
			requiredVotes: required_votes,
		});
		res.status(200).json({ message: "Requirement Added successfully." });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	getRequirements,
	addRequirements,
};
