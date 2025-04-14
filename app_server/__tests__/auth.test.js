const request = require("supertest");
const app = require("../app"); // Import your Express app
const mongoose = require("mongoose");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Mock environment variables
process.env.SECRET_KEY = "test-secret-key";
process.env.ACCESS_TOKEN_EXPIRY = "1h";
process.env.TIARA_CONNECT_API_KEY = "test-api-key";

describe("Auth API Tests", () => {
	let server;

	beforeAll(async () => {
		// Start the server and connect to the test database
		server = app.listen(4000);
		await mongoose.connect("mongodb://localhost:27017/testdb", {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	});

	afterAll(async () => {
		// Close the server and disconnect from the database
		await mongoose.connection.db.dropDatabase();
		await mongoose.connection.close();
		server.close();
	});

	afterEach(async () => {
		// Clear the database after each test
		await User.deleteMany({});
	});

	describe("POST /signup", () => {
		it("should register a new user successfully", async () => {
			const response = await request(app)
				.post("/api/auth/signup")
				.send({
					phone_number: "1234567890",
					admission_number: "BUS-12345",
					password: "password123",
				})
				.expect(201);

			expect(response.body.message).toBe("User registered successfully");
		});

		it("should return 400 if required fields are missing", async () => {
			const response = await request(app)
				.post("/api/auth/signup")
				.send({
					phone_number: "1234567890",
					admission_number: "BUS-12345",
				})
				.expect(400);

			expect(response.body.message).toBe("All fields are required");
		});
	});

	describe("POST /signin", () => {
		beforeEach(async () => {
			// Create a user in the database
			const hashedPassword = await bcrypt.hash("password123", 10);
			await User.create({
				phone_number: "1234567890",
				admission_number: "BUS-12345",
				password: hashedPassword,
			});
		});

		it("should send OTP to the user's phone number", async () => {
			const response = await request(app)
				.post("/api/auth/signin")
				.send({
					admission_number: "BUS-12345",
					password: "password123",
				})
				.expect(200);

			expect(response.body.message).toBe("Verify OTP sent to phone number");
		});

		it("should return 401 for invalid credentials", async () => {
			const response = await request(app)
				.post("/api/auth/signin")
				.send({
					admission_number: "BUS-12345",
					password: "wrongpassword",
				})
				.expect(401);

			expect(response.body.message).toBe("Invalid credentials");
		});
	});

	describe("POST /verify-otp", () => {
		let user;
		let otp;

		beforeEach(async () => {
			// Create a user and store an OTP in the database
			const hashedPassword = await bcrypt.hash("password123", 10);
			user = await User.create({
				phone_number: "1234567890",
				admission_number: "BUS-12345",
				password: hashedPassword,
			});

			otp = "12345"; // Simulate an OTP
			const salt = await bcrypt.genSalt(10);
			const hashedOTP = await bcrypt.hash(otp, salt);
			await User.findOneAndUpdate(
				{ phone_number: "1234567890" },
				{ otp: hashedOTP }
			);
		});

		it("should authenticate the user with a valid OTP", async () => {
			const response = await request(app)
				.post("/api/auth/verify-otp")
				.send({
					phone_number: "1234567890",
					otp,
				})
				.expect(200);

			expect(response.body.message).toBe("Authenticated successfully");
			expect(response.body.accessToken).toBeDefined();
		});

		it("should return 401 for an invalid OTP", async () => {
			const response = await request(app)
				.post("/api/auth/verify-otp")
				.send({
					phone_number: "1234567890",
					otp: "99999",
				})
				.expect(401);

			expect(response.body.message).toBe("Invalid OTP");
		});
	});

	describe("POST /refresh-access-token", () => {
		let refreshToken;

		beforeEach(() => {
			// Generate a refresh token
			refreshToken = jwt.sign(
				{
					admission_number: "BUS-12345",
					phone_number: "1234567890",
					id: "123",
				},
				process.env.SECRET_KEY,
				{ expiresIn: "7d" }
			);
		});

		it("should generate a new access token", async () => {
			const response = await request(app)
				.post("/api/auth/refresh-access-token")
				.send({ refreshToken })
				.expect(200);

			expect(response.body.accessToken).toBeDefined();
		});

		it("should return 403 for an invalid refresh token", async () => {
			const response = await request(app)
				.post("/api/auth/refresh-access-token")
				.send({ refreshToken: "invalid-token" })
				.expect(403);

			expect(response.body.message).toBe("Invalid refresh token");
		});
	});

	describe("GET /user/:admission_number", () => {
		beforeEach(async () => {
			// Create a user in the database
			await User.create({
				phone_number: "1234567890",
				admission_number: "BUS-12345",
				password: "password123",
			});
		});

		it("should retrieve the user by admission number", async () => {
			const response = await request(app)
				.get("/api/auth/user/BUS-12345")
				.expect(200);

			expect(response.body.user.admission_number).toBe("BUS-12345");
		});

		it("should return 404 if the user is not found", async () => {
			const response = await request(app)
				.get("/api/auth/user/NONEXISTENT-12345")
				.expect(404);

			expect(response.body.message).toBe("User not found");
		});
	});

	describe("POST /signout", () => {
		it("should log out the user successfully", async () => {
			const response = await request(app).post("/api/auth/signout").expect(200);

			expect(response.body.message).toBe("Logged out successfully");
		});
	});
});
