const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  type: String,        // aptitude / reasoning
  category: String,    // profit, time, puzzle
  question: String,
  options: [String],
  answer: String,
});

module.exports = mongoose.model("Question", questionSchema);