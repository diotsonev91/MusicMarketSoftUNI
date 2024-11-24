const User = require("../models/User");

// Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get User by Username
exports.getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.editUser = async (req, res) => {
  const { id } = req.params; // Assuming the user ID is provided as a URL parameter
  const { username, email, location, firstname, lastname, role } = req.body;
  console.log(firstname + " " + lastname);
  try {
    // Ensure the user ID is provided
    if (!id) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Check if the user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate uniqueness only if the username or email is being updated
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ error: "Email is already in use" });
      }
    }

    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return res.status(400).json({ error: "Username is already in use" });
      }
    }

    // Update user fields only if they are provided in the request
    if (username) user.username = username;
    if (email) user.email = email;
    if (location) user.location = location;
    if (firstname) user.firstname = firstname;
    if (lastname) user.lastname = lastname;

    // If role is being updated, ensure it adheres to your application's logic
    if (role) {
      const ALLOWED_ROLES = ["user", "admin", "moderator"]; // Example roles
      if (!ALLOWED_ROLES.includes(role)) {
        return res.status(400).json({ error: "Invalid role specified" });
      }
      user.role = role;
    }

    // Save the updated user to the database
    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


