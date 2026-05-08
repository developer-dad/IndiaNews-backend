import SavedNews from "../models/savedNews.model.js";

// Controller to save a news in Database
export const saveNews = async (req, res) => {
  try {
    const {
      article_id,
      title,
      description,
      image_url,
      source,
      link,
      pubDate,
      userID,
    } = req.body;

    // Validate article_id
    if (!article_id) {
      return res.status(400).json({
        success: false,
        message: "Article ID is Required",
      });
    }

    // If news with same article_id present
    const exists = await SavedNews.findOne({
      article_id,
      userID: req.user.id,
    });
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
      userID: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "News Saved Successfully",
      data: news,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Controller to Remove a news from Database
export const removeNews = async (req, res) => {
  try {
    const { article_id } = req.params;

    // Validate article_id
    if (!article_id) {
      return res.status(400).json({
        success: false,
        message: "Article ID is required",
      });
    }

    // Check if saved news exists with article_id
    const news = await SavedNews.findOne({
      article_id,
      userID: req.user.id,
    });
    if (!news) {
      return res.status(404).json({
        success: false,
        message: "News Not Found",
      });
    }

    // Deleteing News
    await news.deleteOne();
    return res.status(200).json({
      success: true,
      message: "Saved News successfully removed",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Controller to get all the saved News of a User
export const getSavedNews = async (req, res) => {
  try {
    const news = await SavedNews.find({ userID: req.user.id }).sort({
      createdAt: -1,
    });
    return res.status(200).json({
      success: true,
      message: "All Saved News Fetched",
      data: news,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};