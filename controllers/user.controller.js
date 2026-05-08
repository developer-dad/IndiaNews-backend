import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import sendOTP from "../utils/sendOTP.js";

// Controller to Create a new user => SignUp
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate
    if (!name || !password || !email) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Required",
      });
    }

    // Password length verification
    if (password.length <= 6) {
      return res.status(401).json({
        success: false,
        message: "Password must be more then 6 letters",
      });
    }

    // Check existing
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email Already Exists",
      });
    }

    // Hash Password
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    // Save to DataBase
    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    // Create Token
    const JWT_SECRET = process.env.JWT_SECRET;
    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    const { password: _, ...userData } = user._doc;

    return res.status(201).json({
      success: true,
      accessToken: accessToken,
      message: "User Created Successfully",
      data: userData,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Controller to Login an existing user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // password validation
    if (password.length <= 6) {
      return res.status(401).json({
        success: false,
        message: "Password must be more then 8 letters.",
      });
    }

    // check email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email Dosen't Exists, Login First.",
      });
    }

    // password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // create token
    const JWT_SECRET = process.env.JWT_SECRET;
    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // removing password from response
    const { password: _, ...userData } = user._doc;

    return res.json({
      success: true,
      accessToken: accessToken,
      message: "Token Created Successfully",
      data: userData,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Logic for sending OTP to Forgot password - (NodeMailer)
export const sendOTPController = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is Required",
      });
    }

    // Check Exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not registered",
      });
    }

    // create OTP
    const OTP = Math.floor(1000 + Math.random() * 9000);

    // save otp to database
    user.otp = OTP;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    // send OTP
    await sendOTP(email, OTP);
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Logic for resetting password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    // validation
    if (!email || !otp || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check Exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Incorrect OTP",
      });
    }

    // check otp expiry
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    // hash new password
    const hashNewPassword = await bcrypt.hash(password, 10);
    user.password = hashNewPassword;

    // clear OTP after use
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password Reset Successful",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
