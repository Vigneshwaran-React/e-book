const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");
const app = express();

dotenv.config();
connectDB();


app.use(cors());
app.use(express.json());

// app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// =====================================================
app.use("/api", require("./routes/bookRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/questions", require("./routes/QuestionRoutes"));

const uploadRoutes = require("./routes/uploadRoutes");
app.use("/api/upload", uploadRoutes);
// =====================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "E-Book Backend API is running"
  });
});

// =======================================================

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

// =====================================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} `);
});