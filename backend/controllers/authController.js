const User = require("../models/User");
const transporter = require("../config/mailer");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// SEND OTP
exports.sendOTP = async (req, res) => {
  try {
    const { email, username } = req.body;

    if (!email || !username) {
      return res.status(400).json({
        success: false,
        message: "Email and username are required",
      });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email, username });
    }

    user.username = username;
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    console.log("Attempting to send OTP email...");

    await transporter.sendMail({
      from: `"E-Book App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    });

    console.log("OTP email sent successfully");

    return res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (error) {
    console.error("SEND OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send OTP email",
      error: error.message,
    });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;

    await user.save();

    res.json({ success: true, message: "OTP verified" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// SET PASSWORD
exports.setPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.isVerified) {
      return res.json({ success: false, message: "OTP not verified" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: "Password set successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }

   const token = jwt.sign(
  { id: user._id },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);

    res.json({
      success: true,
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};