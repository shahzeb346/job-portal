import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc  Register a new user (seeker or employer)
// @route POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, role, company, profileImage } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400);
      throw new Error("Please fill in all required fields");
    }

    if (!["seeker", "employer"].includes(role)) {
      res.status(400);
      throw new Error("Role must be either 'seeker' or 'employer'");
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409);
      throw new Error("An account with this email already exists");
    }

    const userData = { name, email, password, role, profileImage: profileImage || "" };
    if (role === "employer" && company?.name) {
      userData.company = { name: company.name };
    }

    const user = await User.create(userData);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Log in and receive a JWT
// @route POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("Please provide email and password");
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      token: generateToken(user._id, user.role),
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Get the logged-in user's own profile
// @route GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user);
  } catch (err) {
    next(err);
  }
};
