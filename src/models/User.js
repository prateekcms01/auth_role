const bcrypt = require("bcryptjs");
const db = require("../config/database");

const User = {
  create: async (username, password, roles, callback) => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const rolesJson = JSON.stringify(roles); // Ensure roles is stored as a single JSON string

      db.query(
        "INSERT INTO users (username, password, roles) VALUES (?, ?, ?)",
        [username, hashedPassword, rolesJson], // Store roles as a JSON string
        callback
      );
    } catch (err) {
      callback(err);
    }
  },

  findByUsername: (username, callback) => {
    db.query("SELECT * FROM users WHERE username = ?", [username], callback);
  },
};

module.exports = User;
