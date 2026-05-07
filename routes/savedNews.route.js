import express from 'express'
import { removeNews, saveNews } from '../controllers/savedNews.controller.js'

const savedRouter = express.Router()

// To save a news in Database
savedRouter.post('/save-news', saveNews)

// To delete a saved news from Database
savedRouter.delete('/remove-news/:id', removeNews)

export default savedRouter