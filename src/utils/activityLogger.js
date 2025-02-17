const db = require("../config/database"); // Database connection

const logActivity = (userId, action) => {
  return new Promise((resolve, reject) => {
    const sql = "INSERT INTO activity_logs (user_id, action) VALUES (?, ?)";
    db.query(sql, [userId, action], (err, result) => {
      if (err) {
        console.error("Error logging activity:", err);
        return reject(err);
      }
      resolve(result);
    });
  });
};

module.exports = logActivity;
