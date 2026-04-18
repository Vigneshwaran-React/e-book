const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const cloudinary = require("../config/cloudinary");

const Video = require("../models/Video");
const PyqModel = require("../models/Pyq");
const Book = require("../models/Book");

// =====================================================
// 📦 MULTER (TEMP STORAGE)
// =====================================================
const upload = multer({
  dest: "temp/",
  limits: { fileSize: 50 * 1024 * 1024 }, // 🔥 50MB limit
});

// =====================================================
// 🎥 VIDEO UPLOAD
// =====================================================
router.post("/video", upload.single("video"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No video uploaded ❌" });
    }

    const { classId, subject } = req.body;

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
    });

    fs.unlinkSync(req.file.path); // cleanup temp

    const newVideo = new Video({
      classId,
      subject,
      fileUrl: result.secure_url,
    });

    await newVideo.save();

    res.json({
      message: "Video uploaded 🎥🔥",
      data: newVideo,
    });

  } catch (err) {
    console.log("VIDEO ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// =====================================================
// 📥 GET VIDEOS
// =====================================================
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
router.post("/pdf", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF uploaded ❌" });
    }

    const { classId, subject } = req.body;

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw", // 🔥 important
    });

    fs.unlinkSync(req.file.path);

    const newBook = new Book({
      classId: String(classId),
      subject: subject.toLowerCase(),
      pdfUrl: result.secure_url,
    });

    await newBook.save();

    res.json({
      message: "PDF uploaded 📄🔥",
      data: newBook,
    });

  } catch (err) {
    console.log("PDF ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// =====================================================
// 📚 PYQ UPLOAD
// =====================================================
router.post("/pyq", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded ❌" });
    }

    const { classId, subject } = req.body;

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
    });

    fs.unlinkSync(req.file.path);

    const newPyq = new PyqModel({
      classId,
      subject,
      fileUrl: result.secure_url,
    });

    await newPyq.save();

    res.json({
      message: "PYQ uploaded 📚🔥",
      data: newPyq,
    });

  } catch (err) {
    console.log("PYQ ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// =====================================================
// 📥 GET PYQS
// =====================================================
router.get("/pyqs", async (req, res) => {
  try {
    const pyqs = await PyqModel.find().sort({ _id: -1 });
    res.json(pyqs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;