import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";

// ------------------ User Registration ------------------
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash password and create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { email, username, password: hashedPassword },
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Failed to create user!" });
  }
};

// ------------------ User Login ------------------
// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists and passwords match
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid Credentials!" });
    }

    // Create JWT token and set it in HTTP-only cookie
    const token = jwt.sign(
      { id: user.id, isAdmin: false },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    const { password: userPassword, ...userInfo } = user;
    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .status(200)
      .json(userInfo);
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Failed to login" });
  }
};

// ------------------ User Logout ------------------
// @route   POST /api/auth/logout
// @desc    Log out user and clear authentication data
// @access  Private

export const logout = (req, res) => {
  // Clear the JWT token from the cookie
  res.clearCookie("token").status(200).json({
    message: "Logged out successfully.",
  });
};
