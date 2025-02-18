const express = require("express");
const {
  authenticateJWT,
  authorizeRole,
} = require("../middleware/authMiddleware");
const {
  adminAccess,
  teamLeadAccess,
  agentAccess,
} = require("../controllers/roleController");
const router = express.Router();

router.get("/admin", authenticateJWT, authorizeRole(["admin"]), adminAccess);
router.get(
  "/team-lead",
  authenticateJWT,
  authorizeRole(["team_lead"]),
  teamLeadAccess
);
router.get("/agent", authenticateJWT, authorizeRole(["agent"]), agentAccess);

module.exports = router;
