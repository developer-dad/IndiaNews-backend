import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: [6, "Minimum 6 letter of password"]
    },
    otp: {
        type: Number
    },
    otpExpiry: {
        type: Date
    }
})

const User = mongoose.model("User", userSchema)
export default User