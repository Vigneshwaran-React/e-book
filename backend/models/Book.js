const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  classId: String,
  subject: String,
  pdfUrl: String,
});

module.exports = mongoose.model("Book", bookSchema);