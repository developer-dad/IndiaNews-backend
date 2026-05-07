import SavedNews from "../models/savedNews.model.js";

// Controller to save a news in Database
export const saveNews = async (req, res) => {
  try {
    const { article_id, title, description, image_url, source, link, pubDate } =
      req.body;

    // If news with same article_id present
    const exists = await SavedNews.findOne({ article_id });
    if (exists) {
      return res.status(409).json({
        success: true,
        message: "News Already Saved",
      });
    }

    // Save News
    const news = await SavedNews.create({
      article_id,
      title,
      description,
      image_url,
      source,
      link,
      pubDate,
    });

    res.status(201).json({
      success: true,
      message: "News Saved Successfully",
      data: news,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Controller to Remove a news from Database
export const removeNews = async (req, res) => {
  const { article_id } = req.params
}