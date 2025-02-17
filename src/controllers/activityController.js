const db = require("../config/database");

const getActivityLogs = (req, res) => {
  const sql = "SELECT * FROM activity_logs ORDER BY timestamp DESC";
  db.query(sql, (err, results) => {
    if (err)
      return res.status(500).json({ message: "Database Error", error: err });

    res.json(results);
  });
};

module.exports = { getActivityLogs };
