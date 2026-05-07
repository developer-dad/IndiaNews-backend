import mongoose from "mongoose";

const savedNewsSchema = new mongoose.Schema({
    article_id: {
        type: String,
        required: true,
        unique: true
    },
    title: String,
    description: String,
    image_url: String,
    source: String,
    link: String,
    pubDate: Date,
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

const SavedNews = mongoose.model("SavedNews", savedNewsSchema)
export default SavedNews