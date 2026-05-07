import express from "express";
import { login, resetPassword, sendOTPController, signup } from "../controllers/user.controller.js";

const userRouter = express.Router()

// Create a new User => SignUp
userRouter.post('/signup', signup)

// LogIn existing User
userRouter.post('/login', login)

// Send OTP using NodeMailer
userRouter.post('/send-otp', sendOTPController)

// Reset Password using NodeMailer
userRouter.post('/reset-password', resetPassword)

export default userRouter