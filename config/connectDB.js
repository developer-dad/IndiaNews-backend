import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const URI = process.env.MONGO_URI;
    await mongoose.connect(URI);
    console.log("Connected to DB");
  } catch (err) {
    console.log("Error Connecting to DB");
    process.exit(-1);
  }
};

export default connectDB