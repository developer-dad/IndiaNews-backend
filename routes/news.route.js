import express from 'express'
import { fetchNews } from '../controllers/news.controller.js'

const newsRouter = express.Router()

// Route => /api/v1/news/fetch-news
newsRouter.get('/fetch-news', fetchNews)

export default newsRouter