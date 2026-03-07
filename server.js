import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

const API_KEY = [
  process.env.API1,
  process.env.API2,
  process.env.API3,
  process.env.API4,
];

let currentKeyIndex = 0;

const getApiKey = () => {
  return API_KEY[currentKeyIndex];
};

const rotateApiKey = () => {
  currentKeyIndex = (currentKeyIndex + 1) % API_KEY.length;
  console.log(`API key changes to ${currentKeyIndex}`);
};

app.use(cors());

app.get("/", (req, res) => {
  res.send("Server Running - For news data go to /news");
});

app.get("/news", async (req, res) => {
  try {
    let apiKey = getApiKey();

    const { country = "in", category = "top", q, page } = req.query;

    let URL = `https://newsdata.io/api/1/latest?apikey=${apiKey}&language=en&country=${country}&category=${category}${q ? `&q=${q}` : ""}${page ? `&page=${page}` : ""}`;

    let data = await fetch(URL);
    let parsedData = await data.json();

    if (parsedData.status === "error") {
      rotateApiKey();
      apiKey = getApiKey();

      URL = `https://newsdata.io/api/1/latest?apikey=${apiKey}&language=en&size=9&country=${country}&category=${category}${q ? `&q=${q}` : ""}${page ? `&page=${page}` : ""}`
      data = await fetch(URL);
      parsedData = await data.json();
    }

    res.json(parsedData);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listning on http://localhost:${PORT}`);
});
