const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
const app = express();

// 🔥 ENV + DB
dotenv.config();
connectDB();

// 🔥 MIDDLEWARE
app.use(cors());
app.use(express.json());

// 🔥 STATIC FILES (important → before routes is better)
// app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// =====================================================
// 📦 ROUTES
// =====================================================
app.use("/api", require("./routes/bookRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/questions", require("./routes/QuestionRoutes"));

// 🔥 UPLOAD ROUTES
const uploadRoutes = require("./routes/uploadRoutes");
app.use("/api/upload", uploadRoutes);
// =====================================================
// ❌ GLOBAL ERROR HANDLER (optional but pro 🔥)
// =====================================================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

// =====================================================
// 🚀 SERVER
// =====================================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});