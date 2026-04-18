const express = require("express");
const router = express.Router();

const {
  sendOTP,
  verifyOTP,
  setPassword,
  login,
} = require("../controllers/authController");
const User = require("../models/User");
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/set-password", setPassword);
router.post("/login", login);
router.get("/me/:email", async (req, res) => {
  try {
    const email = req.params.email;

    if (!email) {
      return res.status(400).json({ error: "Email missing" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;