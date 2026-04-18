const mongoose = require("mongoose");

const pyqSchema = new mongoose.Schema({
  classId: String,
  subject: String,
  fileUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Pyq", pyqSchema);