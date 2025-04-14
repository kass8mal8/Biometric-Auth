const { Router } = require("express");
const {
	getRequirements,
	addRequirements,
} = require("../controllers/requirements");
const router = new Router();

router.get("/:faculty", getRequirements);
router.post("/add", addRequirements);

module.exports = router;
