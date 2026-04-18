const express = require("express");
const router = express.Router();
const Question = require("../models/Question");


// ==========================================
// ✅ ADD QUESTION
// ==========================================
router.post("/add", async (req, res) => {
  try {
    const { type, category, question, options, answer } = req.body;

    const newQ = new Question({
      type,
      category,
      question,
      options,
      answer,
    });

    await newQ.save();

    res.json({ message: "Question added successfully", data: newQ });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==========================================
// 🔥 GET RANDOM QUESTIONS
// ==========================================
router.get("/random", async (req, res) => {
  try {
    const { type } = req.query;

    const questions = await Question.aggregate([
      { $match: { type } },       // aptitude / reasoning
      { $sample: { size: 10 } }   // random 10 questions
    ]);

    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==========================================
// 🎯 GET BY CATEGORY (optional)
// ==========================================
router.get("/category", async (req, res) => {
  try {
    const { type, category } = req.query;

    const questions = await Question.find({
      type,
      category,
    });

    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ==========================================
// ❌ DELETE QUESTION
// ==========================================
router.delete("/:id", async (req, res) => {
  try {
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 🔥 BULK ADD QUESTIONS
router.post("/bulk", async (req, res) => {
  try {
    const questions = req.body;

    await Question.insertMany(questions);

    res.json({ message: "All questions inserted 🔥" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;