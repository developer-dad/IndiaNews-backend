import fetch from "node-fetch";
import { getApiKey, rotateApiKey } from "../utils/APIRotation.js";

// Controller to Fetch News from the NewsData.io
export const fetchNews = async (req, res) => {
try {
      let apiKey = getApiKey();
      const { country = "in", category = "top", page, q } = req.query;
    
      let URL = `https://newsdata.io/api/1/latest?apikey=${apiKey}&language=en&size=9&country=${country}&category=${category}${q ? `&q=${q}` : ""}${page ? `&page=${page}` : ""}`;
      let data = await fetch(URL);
      let parsedData = await data.json();
    
      // To Rotate API Key
      if (parsedData.status === "error") {
        rotateApiKey();
        apiKey = getApiKey();
    
        URL = `https://newsdata.io/api/1/latest?apikey=${apiKey}&language=en&size=9&country=${country}&category=${category}${q ? `&q=${q}` : ""}${page ? `&page=${page}` : ""}`;
        data = await fetch(URL);
        parsedData = await data.json();
      }      
    
      res.status(200).json({
        success: true,
        message: "News Fetched Successfully",
        data: parsedData
      })    
} catch (error) {
    res.status(500).json({
        success: false,
        message: "Error Fetching News",
        data: error
    })
}
};