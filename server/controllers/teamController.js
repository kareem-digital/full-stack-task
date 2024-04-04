// controllers/teamController.js
const Team = require("../models/Team");
const User = require("../models/User");

exports.createTeam = async (req, res) => {
  const { name, userIds } = req.body;

  try {
    // Fetch users based on provided user IDs
    const users = await User.find({ _id: { $in: userIds } });

    // Check if all provided user IDs are valid
    if (users.length !== userIds.length) {
      return res.status(400).json({ message: "Invalid user IDs provided" });
    }

    // Check for unique domains and availability
    const uniqueDomains = new Set();
    const uniqueAvailability = new Set();
    for (const user of users) {
      if (uniqueDomains.has(user.domain)) {
        return res
          .status(400)
          .json({ message: "Users should have unique domains" });
      }
      uniqueDomains.add(user.domain);

      if (uniqueAvailability.has(user.available)) {
        return res
          .status(400)
          .json({ message: "Users should have unique availability" });
      }
      uniqueAvailability.add(user.available);
    }

    // Create a new team
    const team = new Team({
      name,
      users: userIds,
    });

    // Save the team to the database
    const newTeam = await team.save();
    res.status(201).json(newTeam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate("users");
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
