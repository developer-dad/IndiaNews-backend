import express from "express";
import { fetchUser, login, resetPassword, sendOTPController, signup } from "../controllers/user.controller.js";

const userRouter = express.Router()

// Create a new User => api/v1/user/signup
userRouter.post('/signup', signup)

// LogIn existing User => api/v1/user/login
userRouter.post('/login', login)

// To get User Details
userRouter.get('/fetch-user', fetchUser)

// Send OTP using NodeMailer => api/v1/user/send-otp
userRouter.post('/send-otp', sendOTPController)

// Reset Password using NodeMailer => api/v1/user/reset-password
userRouter.post('/reset-password', resetPassword)

export default userRouter