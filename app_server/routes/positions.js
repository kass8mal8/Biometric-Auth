const { Router } = require("express");
const router = new Router();
const {
	getPosition,
	getAllPositions,
	authenticate,
} = require("../controllers/positions");

router.get("/:admission_number", getPosition);
router.get("/", authenticate, getAllPositions);

module.exports = router;
