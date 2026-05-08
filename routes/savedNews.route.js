import express from 'express'
import { removeNews, saveNews } from '../controllers/savedNews.controller.js'
import { fetchNews } from '../controllers/news.controller.js'
import { authMiddleware } from '../../../Notes/Backend/middleware/user.middleware.js'

const savedRouter = express.Router()

// To save a news in Database => api/v1/save/save-news
savedRouter.post('/save-news', saveNews)

// To delete a saved news from Database => api/v1/save/remove-news/:article-id
savedRouter.delete('/remove-news/:id', removeNews)

// To fetch Saved News of a User From Database => api/v1/save/fetch-saved-news
savedRouter.get('/fetch-saved-news', authMiddleware, fetchNews)

export default savedRouter