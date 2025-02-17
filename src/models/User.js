const bcrypt = require("bcryptjs");
const db = require("../config/database");

const User = {
  // Create a new user
  create: async (username, password, roles, phone, callback) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const rolesJson = JSON.stringify(roles); // Ensure roles is stored as a JSON string

      db.query(
        "INSERT INTO users (username, password, roles, phone) VALUES (?, ?, ?,?)",
        [username, hashedPassword, rolesJson, phone],
        callback
      );
    } catch (err) {
      callback(err);
    }
  },

  // Find a user by username
  findByUsername: (username, callback) => {
    db.query("SELECT * FROM users WHERE username = ?", [username], callback);
  },

  // Update the OTP and its expiration time for a user
  updateOTP: (userId, otp, otpExpires, callback) => {
    db.query(
      "UPDATE users SET otp = ?, otpExpires = ? WHERE id = ?",
      [otp, otpExpires, userId],
      callback
    );
  },

  // Clear the OTP and its expiration time after successful verification
  clearOTP: (userId, callback) => {
    db.query(
      "UPDATE users SET otp = NULL, otpExpires = NULL WHERE id = ?",
      [userId],
      callback
    );
  },
};

module.exports = User;
