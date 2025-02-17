const express = require("express");
const { getActivityLogs } = require("../controllers/activityController");
const {
  authenticateJWT,
  authorizeRole,
} = require("../middleware/authMiddleware");
const router = express.Router();
router.get(
  "/activity-logs",
  authenticateJWT,
  authorizeRole(["admin"]),
  getActivityLogs
);

module.exports = router;
