const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const SECRET_KEY = process.env.SECRET_KEY;
const logActivity = require("../utils/activityLogger");
exports.signup = (req, res) => {
  const { username, password, roles } = req.body;

  if (!Array.isArray(roles) || roles.length === 0) {
    return res
      .status(400)
      .json({ message: "Roles must be an array with at least one role" });
  }

  User.create(username, password, roles, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database Error", error: err });
    }
    logActivity(result.insertId, "User signed up");

    res.status(201).json({ message: "User created successfully" });
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  User.findByUsername(username, async (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const user = results[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    let roles;
    try {
      roles = JSON.parse(user.roles);
    } catch (e) {
      roles = user.roles;
    }

    const token = jwt.sign({ id: user.id, roles }, SECRET_KEY, {
      expiresIn: "24h",
    });
    await logActivity(user.id, "User logged in");
    res.json({ token });
  });
};
