const Candidate = require("../models/candidates");
const jwt = require("jsonwebtoken");
const { savePasskey } = require("./users");

const addCandidate = async (req, res) => {
	const { admission_number, name, position_title, position_group, telephone } =
		req.body;

	try {
		const candidate = await Candidate.create({
			admission_number,
			position_title,
			telephone,
			name,
			position_group,
		});
		res
			.status(201)
			.json({ message: "Candidate added successfully", candidate });
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ message: "Error adding candidate" });
	}
};

const removeCandidate = async (req, res) => {
	const { admission_number } = req.params;

	try {
		await Candidate.findOneAndDelete({ admission_number });
		res.status(200).json({ message: "Candidate removed successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error removing candidate" });
	}
};

const authenticate = (req, res, next) => {
	try {
		const token = req.header("Authorization").replace("Bearer ", "");
		const decoded = jwt.verify(token, process.env.SECRET_KEY);
		req.user = decoded;
		next();
	} catch (error) {
		res.status(401).json({ message: "Authentication failed" });
	}
};

const year = new Date().getFullYear();

const getEcrCandidates = async (req, res) => {
	const { admission_number, position_title } = req.params;

	//candidate must have year of study
	//TODO: check if the candidate has a year of study
	const splittedAdmission = admission_number.split("-");

	const faculty = splittedAdmission[0].toLowerCase();

	try {
		const candidatesFound = await Candidate.find({ position_title });
		const candidates = candidatesFound.filter(
			(candidate) =>
				candidate.admission_number.split("-")[0].toLowerCase() === faculty &&
				candidate.createdAt.getFullYear() === year
		);
		console.log(candidatesFound);
		res.status(200).json(candidates);
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ message: "Error fetching candidates" });
	}
};

const getCandidates = async (req, res) => {
	try {
		const candidates = await Candidate.find({});
		const currentCandidates = candidates.filter(
			(candidate) => candidate.createdAt.getFullYear() === year
		);
		// const filtered =
		// 	currentCandidates.length &&
		// 	currentCandidates.filter((x) => x.position_title === title);

		currentCandidates.length
			? res.status(200).json(currentCandidates)
			: res.status(404).json({ message: "No candidates found" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const updateCandidate = async (req, res) => {
	const { updateDetails } = req.body;
	const { candidate_id } = req.params;

	try {
		await Candidate.findOneAndUpdate({ id: candidate_id, updateDetails });
		res.status(200).json({ message: "Candidate updated successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

module.exports = {
	addCandidate,
	removeCandidate,
	authenticate,
	getEcrCandidates,
	getCandidates,
	updateCandidate,
};
