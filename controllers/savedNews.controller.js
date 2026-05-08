import SavedNews from "../models/savedNews.model.js";

// Controller to save a news in Database
export const saveNews = async (req, res) => {
  try {
    const { article_id, title, description, image_url, source, link, pubDate, userID } =
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
      userID
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
      data: error
    });
  }
};

// Controller to Remove a news from Database
export const removeNews = async (req, res) => {
try {
    const { article_id } = req.params
  
    // Check if saved news exists with article_id
    const news = await SavedNews.findOne({
       article_id,
       userID: req.user.id
    })
    if(!news){
      return res.status(404).json({
        success: false,
        message: "News Not Found"
      })
    }
  
    // Deleteing News
    await news.deleteOne()
    res.status(200).json({
      success: true,
      message: "Saved News successfully removed"
    })  
} catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      data: error
    })
}
}

// Controller to get all the saved News of a User
export const getSavedNews = async (req, res) => {
 try {
   const news = await SavedNews.find({ userID: req.user.id }).sort({ createdAt: -1 })
   res.status(200).json({
     success: true,
     message: "All Saved News Fetched",
     data: news
   })
 } catch (error) {
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    data: error
  })
 }
}