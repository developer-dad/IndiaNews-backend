import "dotenv/config";

import express from 'express'
import cors from 'cors'

import connectDB from "./config/connectDB.js";
import newsRouter from './routes/news.route.js'
import savedRouter from "./routes/savedNews.route.js";
import userRouter from "./routes/user.route.js";

const app = express()

app.use(cors());
app.use(express.json())

// Fetch News from NewsData.io
app.use('/api/v1/news', newsRouter)

// Fetch, Create or Remove News from Saved News collection on MongoDB
app.use('/api/v1/save', savedRouter)

// login, signup, sendotp and resetpassword for a user
app.use('/api/v1/user', userRouter)

connectDB()

const PORT = process.env.PORT || 8080 
app.listen(PORT, () => {
    console.log(`Server Listning on http://localhost:${PORT}`);  
})