module.exports = {
	setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
	testEnvironment: "jsdom",
	transform: {
		"^.+\\.jsx?$": "babel-jest", // Use Babel to transform JavaScript and JSX files
	},
	testEnvironment: "jsdom", // Required for React testing
};
