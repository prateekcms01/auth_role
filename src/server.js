require("dotenv").config();
const express = require("express");
const db = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const roleRoutes = require("./routes/roleRoutes");
const activityRoutes = require("./routes/activityRoutes");

const app = express();
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/roles", roleRoutes);
app.use("/activity", activityRoutes);

// Start the Server
const PORT = process.env.PORT || 8050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
