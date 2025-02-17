exports.adminAccess = (req, res) => {
  res.json({ message: "Welcome Admin, you have full access" });
};

exports.teamLeadAccess = (req, res) => {
  res.json({
    message: "Welcome Team Lead, you can manage agents and escalations",
  });
};

exports.agentAccess = (req, res) => {
  res.json({
    message: "Welcome Agent, you can handle tickets and customer queries",
  });
};
