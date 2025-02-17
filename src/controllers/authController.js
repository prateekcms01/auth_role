const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const twilio = require("twilio");
const logActivity = require("../utils/activityLogger");

const SECRET_KEY = process.env.SECRET_KEY;

// Configure Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Helper function: Generate a random 6-digit OTP as a string
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/**
 * SIGNUP
 * Create a new user with a username, password, and roles.
 */
exports.signup = (req, res) => {
  const { username, password, roles, phone } = req.body;

  if (!Array.isArray(roles) || roles.length === 0) {
    return res
      .status(400)
      .json({ message: "Roles must be an array with at least one role" });
  }

  User.create(username, password, roles, phone, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database Error", error: err });
    }
    logActivity(result.insertId, "User signed up");

    res.status(201).json({ message: "User created successfully" });
  });
};

/**
 * LOGIN
 * Validate username and password, then generate and send an OTP via Twilio.
 */
exports.login = (req, res) => {
  const { username, password } = req.body;

  User.findByUsername(username, async (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = results[0];
    console.log(user);
    console.log(process.env.TWILIO_PHONE_NUMBER);
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate OTP and set expiration time (5 minutes)
    const otp = generateOTP();
    const otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes from now

    // Update user record with OTP and expiration
    User.updateOTP(user.id, otp, otpExpires, (updateErr, updateResult) => {
      if (updateErr) {
        return res
          .status(500)
          .json({ message: "Error updating OTP", error: updateErr });
      }

      // Send OTP via Twilio SMS
      client.messages
        .create({
          body: `Your OTP is: ${otp}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: user.phone, // Make sure the user's phone is stored in your DB
        })
        .then((message) => {
          logActivity(user.id, "OTP sent for login");
          res.json({ message: "OTP sent successfully!" });
        })
        .catch((twilioErr) => {
          console.error("Twilio Error:", twilioErr); // Log detailed error
          return res
            .status(500)
            .json({ message: "Failed to send OTP", error: twilioErr });
        });
    });
  });
};

/**
 * VERIFY OTP
 * Validate the OTP provided by the user and, if correct, generate a JWT.
 */
exports.verifyOTP = (req, res) => {
  const { username, otp } = req.body;

  User.findByUsername(username, async (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = results[0];

    // Check if OTP is valid and not expired
    if (!user.otp || user.otp !== otp || Date.now() > user.otpExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Clear OTP and expiration from the user's record
    User.clearOTP(user.id, (clearErr, clearResult) => {
      if (clearErr) {
        return res
          .status(500)
          .json({ message: "Error clearing OTP", error: clearErr });
      }

      // Parse roles from user record (assuming roles are stored as a JSON string)
      let roles;
      try {
        roles = JSON.parse(user.roles);
      } catch (e) {
        roles = user.roles;
      }

      // Generate a JWT token valid for 24 hours
      const token = jwt.sign({ id: user.id, roles }, SECRET_KEY, {
        expiresIn: "24h",
      });
      logActivity(user.id, "User logged in successfully");
      res.json({ token });
    });
  });
};
