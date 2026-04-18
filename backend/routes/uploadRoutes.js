const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const Video = require("../models/Video");
const PyqModel = require("../models/Pyq");
const Book = require("../models/Book");

// =====================================================
// 📦 MULTER SETUP (FIXED 🔥)
// =====================================================
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "";

    // 🎥 VIDEO
    if (req.originalUrl.includes("/video")) {
      uploadPath = path.join(__dirname, "..", "uploads", "videos");
    }

    // 📚 PYQ
    else if (req.originalUrl.includes("/pyq")) {
      uploadPath = path.join(__dirname, "..", "uploads", "pyqs");
    }

    // 📄 PDF
    else if (req.originalUrl.includes("/pdf")) {
      uploadPath = path.join(__dirname, "..", "uploads", "pdfs");
    }

    // 📦 fallback
    else {
      uploadPath = path.join(__dirname, "..", "uploads");
    }

    // 🔥 auto create folder
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  // 🔥 SAFE FILE NAME
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 },
});

// =====================================================
// 🎥 VIDEO UPLOAD
// =====================================================
router.post("/video", (req, res) => {
  upload.single("video")(req, res, async (err) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    try {
      const { classId, subject } = req.body;

      const newVideo = new Video({
        classId,
        subject,
        fileUrl: `/uploads/videos/${req.file.filename}`,
      });

      await newVideo.save();

      res.json({ message: "Video uploaded 🎥", data: newVideo });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});
// add this in uploadRoutes.js
router.get("/videos", async (req, res) => {
  try {
    const videos = await Video.find().sort({ _id: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// =====================================================
// 📄 PDF UPLOAD
// =====================================================


router.post("/pdf", (req, res) => {
  upload.single("pdf")(req, res, async (err) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    try {
      const { classId, subject } = req.body;

      console.log("BODY:", req.body);

      const newBook = new Book({
        classId: String(classId),
        subject: subject.toLowerCase(),
        pdfUrl: `/uploads/pdfs/${req.file.filename}`,
      });

      await newBook.save(); // 🔥 THIS WAS MISSING

      console.log("Saved to DB:", newBook);

      res.json({
        message: "PDF uploaded & saved 📄🔥",
        data: newBook,
      });

    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
    }
  });
});

// =====================================================
// 📚 PYQ UPLOAD
// =====================================================
router.post("/pyq", (req, res) => {
  upload.single("pdf")(req, res, async (err) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    try {
      const { classId, subject } = req.body;

      const newPyq = new PyqModel({
        classId,
        subject,
        fileUrl: `/uploads/pyqs/${req.file.filename}`,
      });

      await newPyq.save();

      res.json({
        message: "PYQ uploaded 📚🔥",
        data: newPyq,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});

// =====================================================
// 📥 GET ALL PYQS
// =====================================================
router.get("/pyqs", async (req, res) => {
  try {
    const pyqs = await PyqModel.find().sort({ _id: -1 });
    res.json(pyqs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================================
// ❌ DELETE PYQ
// =====================================================
router.delete("/pyq/:id", async (req, res) => {
  try {
    const pyq = await PyqModel.findById(req.params.id);

    if (!pyq) return res.status(404).json({ message: "Not found" });

    const filePath = path.join(
      __dirname,
      "..",
      pyq.fileUrl.replace("/uploads", "uploads")
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await PyqModel.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted ❌" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;