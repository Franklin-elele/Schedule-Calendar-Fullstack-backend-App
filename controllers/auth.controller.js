// const Signup = require("../models/Signup.models");
import Signup from "../models/signup.models.js";
const bcrypt = require("bcrypt");
// const StaffModel = require("../models/staff.models");
import StaffModel from "../models/staff.models.js";

// ---------- Signup Controller ----------
exports.signupUser = async (req, res) => {
  try {
    const { email, name, password, role } = req.body;

    if (!email || !name || !password)
      return res.status(400).json({ error: "Missing required fields" });

    const userSignup = new Signup({
      name,
      email,
      password,
      role: role || "user",
    });

    await userSignup.save();

    const refreshToken = await userSignup.generateRefreshToken();
    const accessToken = await userSignup.generateAccessToken();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(200).json({
      message: "User signed up successfully!",
      user: {
        name: userSignup.name,
        email: userSignup.email,
        role: userSignup.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ---------- Login Controller ----------
exports.loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Missing required fields" });

    let user;
    if (role === "staff") {
      user = await StaffModel.findOne({ email }).select("+password");
    } else {
      user = await Signup.findOne({ email, role }).select("+password");
    }
    if (!user)
      return res.status(400).json({ error: "Invalid email, password, or role" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid password" });

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      message: `${user.role} login successful!`,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    res.clearCookie('accessToken',{
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.clearCookie('refreshToken',{
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    const {_id, role} = req.user
    let user
    if (role === 'staff') {
      user =  await StaffModel.findById(_id)
    } else {
      user = await Signup.findById(_id)
    }
    if (!user) {
      return res.status(404).json({message:'No user found'})
    }

    user.refreshToken = null
    await user.save()
    
    res.status(200).json({message: 'Successful Logout'})
  } catch (err) {
    res.status(400).json({error: err.message })
  }
}