import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

const app = express();

app.use(cors())

app.get('/news', async (req, res) => {
    try{
    const { country = 'in', category = 'top', q, page } = req.query

    const URL = `https://newsdata.io/api/1/latest?apikey=${process.env.API2}&language=en&country=${country}&category=${category}${q ? `&q=${q}` : ""}${page ? `&page=${page}` : ""}`;
    
    const data = await fetch(URL)
    const parsedData = await data.json()
    
    res.json(parsedData)
    } catch(err){
        res.status(500).json({error: "Something went wrong"})
    }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server listning on http://localhost:${PORT}`);
})