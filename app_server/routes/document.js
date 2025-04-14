const { Router } = require("express");
const { uploadDocument, getDocument } = require("../controllers/document");
const router = new Router();

router.post("/upload", uploadDocument);
router.get("/:id", getDocument);

module.exports = router;
