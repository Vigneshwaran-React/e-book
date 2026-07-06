const express = require("express");
const router = express.Router();

const upload = require("../config/upload");
const { uploadBook } = require("../controllers/bookController");
const { verifyToken } = require("../middleware/auth");
const Book = require("../models/Book");

router.post("/upload", upload.single("pdf"), uploadBook);

router.get("/book", async (req, res) => {
  try {
    const { classId, subject } = req.query;

    console.log("QUERY:", classId, subject);

    const book = await Book.findOne({
      classId: String(classId),   
      subject: subject.toLowerCase()
    });

    res.json(book);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;