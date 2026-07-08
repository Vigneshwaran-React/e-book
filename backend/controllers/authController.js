const User = require("../models/User");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =====================================================
// SEND OTP USING BREVO API
// =====================================================

exports.sendOTP = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const username = req.body.username?.trim();

    // VALIDATION
    if (!email || !username) {
      return res.status(400).json({
        success: false,
        message: "Email and username are required",
      });
    }

    // CHECK BREVO ENV VARIABLES
    if (!process.env.BREVO_API_KEY) {
      console.error("BREVO_API_KEY is missing");

      return res.status(500).json({
        success: false,
        message: "Email service API key is missing",
      });
    }

    if (!process.env.BREVO_SENDER_EMAIL) {
      console.error("BREVO_SENDER_EMAIL is missing");

      return res.status(500).json({
        success: false,
        message: "Sender email configuration is missing",
      });
    }

    // CHECK EXISTING USER
    const existingUser = await User.findOne({
      email,
    });

    // USER ALREADY COMPLETED REGISTRATION
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

    // GENERATE 6 DIGIT OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    // CREATE OR UPDATE USER
    let user = existingUser;

    if (!user) {
      user = new User({
        email,
        username,
      });
    }

    user.username = username;
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    user.isVerified = false;

    await user.save();

    console.log("Sending OTP using Brevo API...");

    // SEND OTP USING BREVO HTTP API
    const brevoResponse = await fetch(
      "https://api.brevo.com/v3/smtp/email",
      {
        method: "POST",

        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },

        body: JSON.stringify({
          sender: {
            name: "E-Book App",
            email: process.env.BREVO_SENDER_EMAIL,
          },

          to: [
            {
              email: email,
              name: username,
            },
          ],

          subject: "E-Book App - OTP Verification",

          textContent:
            `Hello ${username}, your OTP is ${otp}. ` +
            `This OTP expires in 5 minutes.`,

          htmlContent: `
            <div
              style="
                font-family: Arial, sans-serif;
                max-width: 500px;
                margin: auto;
                padding: 25px;
              "
            >
              <h2>E-Book App</h2>

              <p>Hello ${username},</p>

              <p>Your OTP verification code is:</p>

              <div
                style="
                  padding: 15px;
                  margin: 20px 0;
                  text-align: center;
                  border: 1px solid #dddddd;
                  border-radius: 8px;
                "
              >
                <h1
                  style="
                    letter-spacing: 6px;
                    font-size: 36px;
                    margin: 0;
                  "
                >
                  ${otp}
                </h1>
              </div>

              <p>This OTP expires in 5 minutes.</p>

              <p>Do not share this OTP with anyone.</p>

              <p>E-Book App Team</p>
            </div>
          `,
        }),
      }
    );

    // READ BREVO RESPONSE
    const responseText = await brevoResponse.text();

    let brevoData = {};

    if (responseText) {
      try {
        brevoData = JSON.parse(responseText);
      } catch {
        brevoData = {
          rawResponse: responseText,
        };
      }
    }

    // BREVO ERROR
    if (!brevoResponse.ok) {
      console.error(
        "BREVO API ERROR:",
        brevoResponse.status,
        brevoData
      );

      return res.status(502).json({
        success: false,
        message: "Failed to send OTP email",
      });
    }

    // SUCCESS
    console.log(
      "OTP sent successfully using Brevo:",
      brevoData.messageId
    );

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
    const email = req.body.email?.trim().toLowerCase();
    const otp = String(req.body.otp || "").trim();

    // VALIDATION
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // FIND USER
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // CHECK OTP
    if (!user.otp || String(user.otp) !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // CHECK OTP EXPIRY
    if (!user.otpExpiry || user.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // OTP VERIFIED
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    console.log("OTP verified successfully for:", email);

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
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    // VALIDATION
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters",
      });
    }

    // FIND USER
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "OTP not verified",
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    await user.save();

    console.log("Password set successfully for:", email);

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
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password;

    // VALIDATION
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // FIND USER
    const user = await User.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // CHECK REGISTRATION COMPLETE
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "Please complete registration first",
      });
    }

    // CHECK PASSWORD
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

    // CHECK JWT SECRET
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing");

      return res.status(500).json({
        success: false,
        message: "Server authentication configuration error",
      });
    }

    // CREATE JWT TOKEN
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    console.log("Login successful for:", email);

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