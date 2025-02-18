const bcrypt = require("bcryptjs");
const db = require("../config/database");

const User = {
  create: async (username, password, roles, phone, callback) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const rolesJson = JSON.stringify(roles);

      db.query(
        "INSERT INTO users (username, password, roles, phone) VALUES (?, ?, ?,?)",
        [username, hashedPassword, rolesJson, phone],
        callback
      );
    } catch (err) {
      callback(err);
    }
  },

  findByUsername: (username, callback) => {
    db.query("SELECT * FROM users WHERE username = ?", [username], callback);
  },

  updateOTP: (userId, otp, otpExpires, callback) => {
    db.query(
      "UPDATE users SET otp = ?, otpExpires = ? WHERE id = ?",
      [otp, otpExpires, userId],
      callback
    );
  },

  clearOTP: (userId, callback) => {
    db.query(
      "UPDATE users SET otp = NULL, otpExpires = NULL WHERE id = ?",
      [userId],
      callback
    );
  },
};

module.exports = User;
