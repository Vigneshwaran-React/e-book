const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  classId: String,
  subject: String,
  fileUrl: String,
});

module.exports = mongoose.model("Video", videoSchema);