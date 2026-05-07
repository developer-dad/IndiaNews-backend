import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import sendOTP from "../utils/sendOTP.js";


// Controller to Create a new user => SignUp
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Normalise name and email
    const normName = name.trim().toLowerCase();
    const normEmail = email.trim().toLowerCase();

    // Validate
    if (!normName || !password || !normEmail) {
      return res.status(400).json({
        success: false,
        message: "All Fields are Required",
      });
    }

    // Password length verification
    if (password.length < 6) {
      return res.status(401).json({
        success: false,
        message: "Password must be more then 6 letters",
      });
    }

    // Check existing
    const existing = await User.findOne({ email: normEmail });
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
      name: normName,
      email: normEmail,
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

    res.status(201).json({
      success: true,
      accessToken: accessToken,
      message: "User Created Successfully",
      data: userData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Controller to Login an existing user
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // normailze email
    const normEmail = email.trim().toLowerCase();

    // validate
    if (!normEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // password validation
    if (password.length < 6) {
      return res.status(401).json({
        success: false,
        message: "Password must have 6 letters",
      });
    }

    // check email exists
    const user = await User.findOne({ email: normEmail });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // removing password from response
    const { password: _, ...userData } = user._doc;

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
    res.json({
      success: true,
      accessToken: accessToken,
      message: "Token Created Successfully",
      data: userData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// Logic for sending OTP to Forgot password - (NodeMailer)
export const sendOTPController = async (req, res) => {
try {
    const { email } = req.body;
    // validate email
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
    user.otp = OTP
    user.otpExpiry = Date.now() + 10 * 60 * 1000
    await user.save()
  
    // send OTP
    await sendOTP(email, OTP)
    res.status(200).json({
      success: true,
      message: "OTP sent successfully"
    })
} catch (err) {
  res.status(500).json({
    success: false,
    message: "Something went wrong"
  })
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
        message: "All fields are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.otp !== otp.toString()) {
      return res.status(400).json({
        success: false,
        message: "Incorrect OTP"
      });
    }

    // check otp expiry
    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired"
      });
    }

    // hash new password
    const hashNewPassword = await bcrypt.hash(password, 10);
    user.password = hashNewPassword;

    // clear OTP after use
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password Reset Successful"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};