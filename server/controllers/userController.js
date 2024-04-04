// controllers/userController.js
const User = require("../models/User");
// const userData = require("../data/heliverse_mock_data.json");

// exports.insertUserData = async (req, res) => {
//   try {
//     const users = await User.insertMany(userData);
//     res.status(201).json({ message: "User data inserted successfully", users });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

exports.getAllUsers = async (req, res) => {
  const { domain, gender, available, query, page } = req.query;
  const filters = {};

  // Apply filters
  if (domain) {
    filters.domain = domain;
  }
  if (gender) {
    filters.gender = gender;
  }
  if (available !== undefined) {
    filters.available = available === "true";
  }

  // Apply search query
  const searchQuery = {};
  if (query) {
    searchQuery.$or = [
      { first_name: { $regex: query, $options: "i" } },
      { last_name: { $regex: query, $options: "i" } },
    ];
  }

  // Apply pagination
  const pageNumber = parseInt(page) || 1;
  const pageSize = 20; // Number of records per page
  const skip = (pageNumber - 1) * pageSize;

  try {
    // Fetch users for the current page
    const users = await User.find({ ...filters, ...searchQuery })
      .skip(skip)
      .limit(pageSize);

    // Get total count of users matching the query
    const count = await User.countDocuments({ ...filters, ...searchQuery });

    // Calculate total number of pages
    const pageCount = Math.ceil(count / pageSize);

    // Send response with pagination details and user data
    res.status(200).json({
      pagination: {
        count,
        pageCount,
        currentPage: pageNumber, // Return the current page number
      },
      users,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createUser = async (req, res) => {
  const user = new User(req.body);
  try {
    const newUser = await user.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    Object.assign(user, req.body);
    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await User.deleteOne({ _id: req.params.id });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
