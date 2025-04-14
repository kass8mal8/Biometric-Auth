const mongoose = require("mongoose");
const Position = require("./models/positions");

const positions = [
	{ position_group: "Student Council", total: 7, filled: 0 },
	{
		position_group: "ECR",
		total: 90,
		filled: 0,
	},
	{
		position_group: "Congress",
		total: 9,
		filled: 0,
	},
	// Add more positions as needed
];

mongoose.connect("mongodb://localhost:27017/mmuvoting", {
	useNewUrlParser: true,
});

const seedPositions = async () => {
	try {
		await Position.deleteMany(); // Clear existing positions
		await Position.insertMany(positions);
		console.log("Positions seeded successfully");
		mongoose.connection.close();
	} catch (error) {
		console.error("Error seeding positions:", error);
		mongoose.connection.close();
	}
};

seedPositions();
