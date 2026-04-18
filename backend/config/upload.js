const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("MIME:", file.mimetype);

    let uploadPath = "";

    // 🎥 Video
    if (file.mimetype.startsWith("video")) {
      uploadPath = path.join(__dirname, "..", "uploads", "videos");
    }

    // 📚 PYQ PDF
    else if (
      file.mimetype === "application/pdf" &&
      req.body.type === "pyq"
    ) {
      uploadPath = path.join(__dirname, "..", "uploads", "pyqs");
    }

    // 📄 Normal PDF
    else if (file.mimetype === "application/pdf") {
      uploadPath = path.join(__dirname, "..", "uploads", "pdfs");
    }

    // 📦 Others
    else {
      uploadPath = path.join(__dirname, "..", "uploads");
    }

    // 🔥 auto create folder
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 200 * 1024 * 1024 },
});

module.exports = upload;