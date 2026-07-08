const User = require("../models/User");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =====================================================
// NODEMAILER SETUP
// =====================================================

const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});

// =====================================================
// SEND OTP
// =====================================================

exports.sendOTP = async (req, res) => {
  try {
    const { email, username } = req.body;

    if (!email || !username) {
      return res.status(400).json({
        success: false,
        message: "Email and username are required",
      });
    }

    // Check completed account
    const existingUser = await User.findOne({ email });

    if (
      existingUser &&
      existingUser.isVerified &&
      existingUser.password
    ) {
      return res.status(409).json({
        success: false,
        message: "Account already exists. Please login.",
      });
    }

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    let user = existingUser;

    if (!user) {
      user = new User({
        email: email.toLowerCase(),
        username,
      });
    }

    user.username = username;
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    user.isVerified = false;

    await user.save();

    console.log("Sending OTP using Gmail...");

    await transporter.sendMail({
      from: `"E-Book App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "E-Book App - OTP Verification",
      text: `Your OTP is ${otp}. It expires in 5 minutes.`,
      html: `
        <div style="font-family:Arial,sans-serif;padding:20px;">
          <h2>E-Book App</h2>

          <p>Hello ${username},</p>

          <p>Your OTP verification code is:</p>

          <h1 style="letter-spacing:6px;">
            ${otp}
          </h1>

          <p>This OTP expires in 5 minutes.</p>

          <p>Do not share this OTP with anyone.</p>
        </div>
      `,
    });

    console.log("OTP sent successfully to:", email);

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

// =====================================================
// VERIFY OTP
// =====================================================

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.otp || user.otp !== String(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (!user.otpExpiry || user.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    user.isVerified = true;

    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified",
    });

  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// SET PASSWORD
// =====================================================

exports.setPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user || !user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "OTP not verified",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters",
      });
    }

    user.password = await bcrypt.hash(password, 10);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password set successfully",
    });

  } catch (error) {
    console.error("SET PASSWORD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// LOGIN
// =====================================================

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "Please complete registration first",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};