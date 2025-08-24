const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Validate password
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT
    const token = generateToken(admin._id);

    // Send as cookie + response
    res
      .cookie("token", token, {
        httpOnly: true,     // can’t be accessed via JS
        secure: process.env.NODE_ENV === "production", // only https in prod
        sameSite: "strict", // protect against CSRF
        maxAge: 60 * 60 * 1000, // 1 hour
      })
      .status(200)
      .json({
        token: token,
        success: true,
        message: "Login successful",
        admin: {
          id: admin._id,
          email: admin.email,
        },
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.addAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Create new admin
    const admin = await Admin.create({ email, password });

    // Generate JWT
    const token = generateToken(admin._id);

    res.status(201).json({
      message: "Admin created successfully",
      token,
      admin: {
        id: admin._id,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
