const pdf = require("pdf-parse");

const extractTextFromPDF = async (buffer) => {
	return pdf(buffer).then((data) => data.text);
};

const parseDocument = async (file) => {
	const buffer = file.buffer;

	if (file.mimetype === "application/pdf") {
		return extractTextFromPDF(buffer);
	} else {
		throw new Error("Unsupported file format. Only PDF files are supported.");
	}
};

module.exports = { parseDocument };
