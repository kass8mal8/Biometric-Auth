const User = require("../models/users");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { SECRET_KEY, ACCESS_TOKEN_EXPIRY, EMAIL_ADDRESS, APP_PASSWORD } =
	process.env;
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { generateAuthenticationOptions } = require("@simplewebauthn/server");

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: EMAIL_ADDRESS,
		pass: APP_PASSWORD,
	},
	port: 587,
	secure: false,
});

const generateToken = (payload) => {
	const accessToken = jwt.sign(payload, SECRET_KEY, {
		expiresIn: ACCESS_TOKEN_EXPIRY,
		algorithm: "HS256",
	});

	const refreshToken = jwt.sign(payload, SECRET_KEY, {
		expiresIn: "7d", // Set the refresh token expiry time (e.g., 7 days)
		algorithm: "HS256",
	});

	return { accessToken, refreshToken };
};

// generate otp

const generateOTP = () => {
	const min = 10000;
	const max = 99999;
	return Math.floor(Math.random() * (max - min + 1)) + min;
};

const signup = async (req, res) => {
	const { admission_number, password, email } = req.body;
	if (!admission_number || !password || !email) {
		return res.status(400).json({ message: "All fields are required" });
	}

	try {
		await User.create({
			email,
			password,
			admission_number,
		});

		res.status(201).json({ message: "User registered successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const signin = async (req, res) => {
	const { email, password } = req.body;
	console.log("Email:", email);
	console.log("Password:", password);
	try {
		await User.login(email, password);

		const generatedOTP = generateOTP();

		const salt = await bcrypt.genSalt(10);
		const hashedOTP = await bcrypt.hash(String(generatedOTP), salt);
		await User.findOneAndUpdate({ email }, { otp: hashedOTP });

		const mailOptions = {
			from: EMAIL_ADDRESS,
			to: email,
			subject: "Biometric Voting - OTP Verification", // Subject line
			text: `Your One-Time Password (OTP) is: ${generatedOTP}`, // plain text body
		};

		await transporter.sendMail(mailOptions);

		res.status(200).json({ message: "verify OTP sent to email", generatedOTP });
	} catch (error) {
		console.log("error:", error.message);
		res.status(401).json({ message: error.message });
	}
};

const verifyOTP = async (req, res) => {
	const { otp, email } = req.body;
	console.log(otp, email);

	try {
		const user = await User.findOne({ email });

		const { accessToken } = generateToken({
			admission_number: user.admission_number,
			email: user.email,
			id: user.id,
			name: user.name,
		});

		const dbOTP = bcrypt.compareSync(otp, user.otp);

		if (!dbOTP) return res.status(401).json({ message: "Invalid OTP" });

		await User.findOneAndUpdate({ email }, { otp: null });

		res
			.status(200)
			.json({ message: "Authenticated successfully", accessToken });
	} catch (error) {
		console.log("Error:", error.message);
		res.status(500).json({ error: error.message });
	}
};

const authenticate = (req, res, next) => {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "No token provided" });
	}

	jwt.verify(token, SECRET_KEY, (err, user) => {
		if (err) {
			console.log(err.message);
			return res.status(403).json({ message: "Invalid token" });
		}

		req.user = user;
		next();
	});
};

const signout = (req, res) => {
	req.session.destroy();

	res.clearCookie("token");
	res.status(200).json({ message: "Logged out successfully" });
};

const getUser = async (req, res) => {
	try {
		const { admission_number, email } = req.params;

		if (!admission_number && !email) {
			return res
				.status(400)
				.json({ message: "Admission number or email is required" });
		}

		const user = await User.findOne({
			$or: [{ admission_number }, { email }],
		});

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json(user);
	} catch (error) {
		console.error("Error fetching user:", error.message);
		res.status(500).json({ message: "Server error" });
	}
};

const refreshAccessToken = (req, res) => {
	const { refreshToken } = req.body;

	if (!refreshToken) {
		return res.status(401).json({ message: "No refresh token provided" });
	}

	jwt.verify(refreshToken, SECRET_KEY, (err, user) => {
		if (err) {
			return res.status(403).json({ message: "Invalid refresh token" });
		}

		const { accessToken } = generateToken({
			admission_number: user.admission_number,
			email: user.email,
			id: user.id,
		});

		res.status(200).json({ accessToken });
	});
};

// Helper to convert buffer to base64url
const bufferToBase64url = (buffer) => {
	return buffer
		.toString("base64")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=/g, "");
};

// Generate Registration Challenge
const generateRegistrationChallenge = async (req, res) => {
	try {
		const { email } = req.params;
		const user = await User.findOne({ email });

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const challenge = crypto.randomBytes(32);
		const userId = Buffer.from(user._id.toString());

		res.status(200).json({
			challenge: bufferToBase64url(challenge),
			rp: { name: "KSL Summarization System", id: "localhost" }, // Update to your domain in production
			user: {
				id: bufferToBase64url(userId),
				name: email,
				displayName: email,
			},
			pubKeyCredParams: [
				{ alg: -7, type: "public-key" }, // ES256
				{ alg: -257, type: "public-key" }, // RS256
			],
			authenticatorSelection: {
				authenticatorAttachment: "platform",
				userVerification: "preferred",
			},
			timeout: 60000,
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Save Passkey Credential
const savePasskey = async (req, res) => {
	try {
		const { email, credential } = req.body;

		if (!email || !credential) {
			return res
				.status(400)
				.json({ message: "Missing email or credential data" });
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		if (
			!credential.id ||
			!credential.response ||
			!credential.response.attestationObject
		) {
			return res.status(400).json({ message: "Invalid credential data" });
		}

		user.passkeys = user.passkeys || [];
		user.passkeys.push({
			credentialId: credential.id,
			publicKey: credential.response.attestationObject,
			signCount: 0,
		});

		await user.save();
		res.status(200).json({ message: "Passkey saved successfully" });
	} catch (error) {
		res.status(500).json({ message: "Error saving passkey: " + error.message });
	}
};

const generateAuthenticationChallenge = async (req, res) => {
	const { email } = req.params;

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Check if the user has any passkeys
		if (!user.passkeys || user.passkeys.length === 0) {
			return res
				.status(400)
				.json({ message: "No passkeys registered for this user" });
		}

		console.log("User passkeys:", user.passkeys);

		// Generate authentication options
		const options = generateAuthenticationOptions({
			rpID: "localhost", // Replace with your domain in production
			userVerification: "preferred",
			allowCredentials: user.passkeys.map((passkey) => ({
				id: passkey.credentialId,
				type: "public-key",
				transports: ["internal"], // Prioritize platform authenticators
			})),
		});

		// Save the challenge to the user record (or session) for later verification
		user.currentChallenge = options.challenge;
		await user.save();

		res.status(200).json(options);
	} catch (error) {
		console.error("Error generating authentication challenge:", error);
		res.status(500).json({ message: "Server error" });
	}
};

module.exports = {
	signup,
	signin,
	verifyOTP,
	signout,
	authenticate,
	refreshAccessToken,
	getUser,
	generateRegistrationChallenge,
	savePasskey,
	generateAuthenticationChallenge,
};
