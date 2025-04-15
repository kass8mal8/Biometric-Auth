const { Router } = require("express");
const {
	signup,
	signin,
	verifyOTP,
	authenticate,
	getUser,
	refreshAccessToken,
	generateRegistrationChallenge,
	savePasskey,
	generateAuthenticationChallenge,
} = require("../controllers/users");
const router = new Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/verify_otp", verifyOTP);
router.get("/profile", authenticate, (req, res) => {
	res.json(req.user);
});
router.get("/user/:admission_number?/:email?", getUser);
router.post("/refresh_token", refreshAccessToken);
router.get(
	"/generate-registration-challenge/:email",
	generateRegistrationChallenge
);
router.get(
	"/generate-authentication-challenge/:email",
	generateAuthenticationChallenge
);
router.post("/save-passkey", savePasskey);

module.exports = router;
