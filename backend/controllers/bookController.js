const Book = require("../models/Book");

exports.uploadBook = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    if (!req.file) {
      return res.json({ success: false, message: "No file uploaded" });
    }

    const { classId, subject } = req.body;

    const fileUrl = `/uploads/pdfs/${req.file.filename}`; // ✅ FIX

    const book = new Book({
      classId,
      subject: subject.toLowerCase(),
      pdfUrl: fileUrl,
    });

    await book.save();

    console.log("Saved to DB ✅");

    res.json({ success: true, book });

  } catch (err) {
    console.log("ERROR:", err);
    res.json({ success: false, message: err.message });
  }
};