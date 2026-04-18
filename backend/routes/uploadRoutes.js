const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const cloudinary = require("../config/cloudinary");

const Video = require("../models/Video");
const PyqModel = require("../models/Pyq");
const Book = require("../models/Book");

// TEMP STORAGE (only for upload)
const upload = multer({ dest: "temp/" });

// =====================================================
// 🎥 VIDEO UPLOAD
// =====================================================
router.post("/video", upload.single("video"), async (req, res) => {
  try {
    const { classId, subject } = req.body;

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "video",
    });

    fs.unlinkSync(req.file.path); // delete temp

    const newVideo = new Video({
      classId,
      subject,
      fileUrl: result.secure_url, // ✅ CLOUD URL
    });

    await newVideo.save();

    res.json({ message: "Video uploaded 🎥", data: newVideo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET VIDEOS
router.get("/videos", async (req, res) => {
  const videos = await Video.find().sort({ _id: -1 });
  res.json(videos);
});

// =====================================================
// 📄 PDF UPLOAD
// =====================================================
router.post("/pdf", upload.single("pdf"), async (req, res) => {
  try {
    const { classId, subject } = req.body;

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
    });

    fs.unlinkSync(req.file.path);

    const newBook = new Book({
      classId,
      subject: subject.toLowerCase(),
      pdfUrl: result.secure_url, // ✅ CLOUD URL
    });

    await newBook.save();

    res.json({ message: "PDF uploaded 📄", data: newBook });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================================
// 📚 PYQ UPLOAD
// =====================================================
router.post("/pyq", upload.single("pdf"), async (req, res) => {
  try {
    const { classId, subject } = req.body;

    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
    });

    fs.unlinkSync(req.file.path);

    const newPyq = new PyqModel({
      classId,
      subject,
      fileUrl: result.secure_url, // ✅ CLOUD URL
    });

    await newPyq.save();

    res.json({ message: "PYQ uploaded 📚", data: newPyq });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================================
// GET PYQS
// =====================================================
router.get("/pyqs", async (req, res) => {
  const pyqs = await PyqModel.find().sort({ _id: -1 });
  res.json(pyqs);
});

module.exports = router;