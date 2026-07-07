const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const cloudinary = require("../config/cloudinary");

const Video = require("../models/Video");
const PyqModel = require("../models/Pyq");
const Book = require("../models/Book");


// =====================================================
// MULTER LOCAL TEMP STORAGE
// =====================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;

    if (req.originalUrl.includes("/video")) {
      uploadPath = path.join(__dirname, "..", "uploads", "videos");
    } else if (req.originalUrl.includes("/pyq")) {
      uploadPath = path.join(__dirname, "..", "uploads", "pyqs");
    } else if (req.originalUrl.includes("/pdf")) {
      uploadPath = path.join(__dirname, "..", "uploads", "pdfs");
    } else {
      uploadPath = path.join(__dirname, "..", "uploads");
    }

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    cb(null, `${Date.now()}${ext}`);
  },
});


const upload = multer({
  storage,

  limits: {
    fileSize: 200 * 1024 * 1024,
  },
});


// =====================================================
// VIDEO UPLOAD
// CURRENTLY LOCAL STORAGE
// =====================================================

router.post("/video", (req, res) => {
  upload.single("video")(req, res, async (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No video uploaded",
      });
    }

    try {
      const { classId, subject } = req.body;

      if (!classId || !subject) {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(400).json({
          success: false,
          message: "classId and subject are required",
        });
      }

      const newVideo = new Video({
        classId: String(classId),
        subject: subject.toLowerCase(),
        fileUrl: `/uploads/videos/${req.file.filename}`,
      });

      await newVideo.save();

      return res.status(201).json({
        success: true,
        message: "Video uploaded successfully",
        data: newVideo,
      });
    } catch (error) {
      console.error("VIDEO UPLOAD ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Video upload failed",
        error: error.message,
      });
    }
  });
});


// =====================================================
// GET ALL VIDEOS
// =====================================================

router.get("/videos", async (req, res) => {
  try {
    const videos = await Video.find().sort({ _id: -1 });

    return res.json(videos);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});


// =====================================================
// PDF UPLOAD TO CLOUDINARY
// =====================================================

router.post("/pdf", (req, res) => {
  upload.single("pdf")(req, res, async (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No PDF uploaded",
      });
    }

    try {
      const { classId, subject } = req.body;

      if (!classId || !subject) {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(400).json({
          success: false,
          message: "classId and subject are required",
        });
      }

      console.log("Uploading PDF to Cloudinary...");

      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "raw",
        folder: "ebook/pdfs",
        public_id: `pdf-${Date.now()}`,
      });

      console.log("PDF Cloudinary URL:", result.secure_url);

      const newBook = new Book({
        classId: String(classId),
        subject: subject.toLowerCase(),
        pdfUrl: result.secure_url,
      });

      await newBook.save();

      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(201).json({
        success: true,
        message: "PDF uploaded successfully",
        data: newBook,
      });
    } catch (error) {
      console.error("PDF UPLOAD ERROR:", error);

      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(500).json({
        success: false,
        message: "PDF upload failed",
        error: error.message,
      });
    }
  });
});


// =====================================================
// PYQ UPLOAD TO CLOUDINARY
// =====================================================

router.post("/pyq", (req, res) => {
  upload.single("pdf")(req, res, async (err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No PYQ PDF uploaded",
      });
    }

    try {
      const { classId, subject } = req.body;

      if (!classId || !subject) {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(400).json({
          success: false,
          message: "classId and subject are required",
        });
      }

      console.log("Uploading PYQ to Cloudinary...");

      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "raw",
        folder: "ebook/pyqs",
        public_id: `pyq-${Date.now()}`,
      });

      console.log("PYQ Cloudinary URL:", result.secure_url);

      const newPyq = new PyqModel({
        classId: String(classId),
        subject: subject.toLowerCase(),
        fileUrl: result.secure_url,
      });

      await newPyq.save();

      if (fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(201).json({
        success: true,
        message: "PYQ uploaded successfully",
        data: newPyq,
      });
    } catch (error) {
      console.error("PYQ UPLOAD ERROR:", error);

      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(500).json({
        success: false,
        message: "PYQ upload failed",
        error: error.message,
      });
    }
  });
});


// =====================================================
// GET ALL PYQS
// =====================================================

router.get("/pyqs", async (req, res) => {
  try {
    const pyqs = await PyqModel.find().sort({ _id: -1 });

    return res.json(pyqs);
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});


// =====================================================
// DELETE PYQ DATABASE RECORD
// =====================================================

router.delete("/pyq/:id", async (req, res) => {
  try {
    const pyq = await PyqModel.findById(req.params.id);

    if (!pyq) {
      return res.status(404).json({
        success: false,
        message: "PYQ not found",
      });
    }

    // Delete local file only for old local-storage records.
    if (pyq.fileUrl && !pyq.fileUrl.startsWith("http")) {
      const relativePath = pyq.fileUrl.replace(/^\/uploads/, "uploads");

      const filePath = path.join(
        __dirname,
        "..",
        relativePath
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await PyqModel.findByIdAndDelete(req.params.id);

    return res.json({
      success: true,
      message: "PYQ deleted successfully",
    });
  } catch (error) {
    console.error("DELETE PYQ ERROR:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});


module.exports = router;