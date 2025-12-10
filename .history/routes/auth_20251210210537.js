import bcrypt from "bcrypt";
import express from "express";
import Joi from "joi";
import jwt from "jsonwebtoken";
import User from "../db/models/user.js";
import { ApiError } from "../middleware/errorHandler.js";
import { validateBody } from "../middleware/validate.js";

const router = express.Router();

const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().min(2).required(),
  role: Joi.string().valid("admin", "user", "trainer").default("user"),
});

// Helper function to generate JWT
const generateJWT = (user) => {
  return jwt.sign(
    {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "2d" }
  );
};

// Helper function to create user response
const createUserResponse = (user, token) => ({
  token,
  user: {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    name: user.name,
  },
});

// Regular email/password signup
router.post("/signup", validateBody(signupSchema), async (req, res, next) => {
  console.log("signup///////////");
  try {
    const { email, password, name, role } = req.body;

    const emailLower = email.toLowerCase();
    const existing = await User.findOne({ email: emailLower });
    if (existing) throw new ApiError(400, "Email already in use");

    const user = new User({
      email: emailLower,
      password,
      name,
      role: role || "user",
    });

    await user.save();

    const token = generateJWT(user);
    res.status(201).json(createUserResponse(user, token));
  } catch (err) {
    // Handle Mongoose duplicate key error
    if (err.code === 11000) {
      return next(new ApiError(400, "Email already in use"));
    }
    next(err);
  }
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Regular email/password login
router.post("/login", validateBody(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const emailLower = email.toLowerCase();

    //Mahmoud@gmail.com
    // MAHMOUD@GMAIL.COM

    const user = await User.findOne({ email: emailLower });
    if (!user) throw new ApiError(401, "Invalid credentials");

    // Check if user signed up with Google (no password)
    if (!user.password && user.googleId) {
      throw new ApiError(401, "Please sign in with Google");
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new ApiError(401, "Invalid credentials");

    const token = generateJWT(user);
    res.json(createUserResponse(user, token));
  } catch (err) {
    next(err);
  }
});

export default router;
