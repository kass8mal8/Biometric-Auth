const { Router } = require("express");
const {
	addCandidate,
	removeCandidate,
	getEcrCandidates,
	authenticate,
	getCandidates,
	updateCandidate,
} = require("../controllers/candidates");
const router = new Router();

router.post("/add_candidate", addCandidate);
router.delete("/:admission_number", authenticate, removeCandidate);
router.get(
	"/:admission_number/:position_title",
	authenticate,
	getEcrCandidates
);
router.get("/", authenticate, getCandidates);
router.put("/:candidate_id", updateCandidate);

module.exports = router;
