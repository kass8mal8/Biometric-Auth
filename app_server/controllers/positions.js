const Position = require("../models/positions");
const Document = require("../models/document");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = process.env;

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

const getPosition = async (req, res) => {
	const { admission_number } = req.params;

	try {
		const positions = await Position.find({});

		res.status(200).json(positions);
	} catch (error) {
		console.log(error.message);
	}
};

const checkNominationForm = async (position_id) => {
	try {
		const document = await Document.find({ position: position_id });
		return document.length ? true : false; // Return true if documents exist, otherwise false
	} catch (error) {
		console.error("Error checking nomination form:", error);
		return false; // Return false in case of an error
	}
};

const getAllPositions = async (req, res) => {
	try {
		const positions = await Position.find({});

		// Add nomination status to each position
		// const council = await Promise.all(
		// 	positions
		// 		.filter((position) => position.position_group === "Student Council")
		// 		.map(async (position) => ({
		// 			...position._doc, // Spread the position object
		// 			formAvailable: await checkNominationForm(position._id), // Add nomination status
		// 		}))
		// );

		// const congress = await Promise.all(
		// 	positions
		// 		.filter((position) => position.position_group === "Congress")
		// 		.map(async (position) => ({
		// 			...position._doc,
		// 			formAvailable: await checkNominationForm(position._id),
		// 		}))
		// );

		// const delegate = await Promise.all(
		// 	positions
		// 		.filter((position) => position.position_group === "ECR")
		// 		.map(async (position) => ({
		// 			...position._doc,
		// 			formAvailable: await checkNominationForm(position._id),
		// 		}))
		// );

		// Send the response with all positions and their nomination status
		res.status(200).json(positions);
	} catch (error) {
		console.error("Error fetching positions:", error.message);
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	getPosition,
	getAllPositions,
	authenticate,
};
