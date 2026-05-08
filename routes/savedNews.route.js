import express from 'express'
import { getSavedNews, removeNews, saveNews } from '../controllers/savedNews.controller.js'
import { authMiddleware } from '../middleware/user.middleware.js'

const savedRouter = express.Router()

// To save a news in Database => api/v1/save/save-news
savedRouter.post('/save-news', authMiddleware, saveNews)

// To delete a saved news from Database => api/v1/save/remove-news/:article-id
savedRouter.delete('/remove-news/:article_id', authMiddleware, removeNews)

// To fetch Saved News of a User From Database => api/v1/save/fetch-saved-news
savedRouter.get('/fetch-saved-news', authMiddleware, getSavedNews)

export default savedRouter