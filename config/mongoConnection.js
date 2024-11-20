const { mongoose } = require("mongoose");
const asyncHandler = require("express-async-handler");

const connectToMongoDB = asyncHandler(async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI + "/" + process.env.DB_NAME;
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB!");
    return true;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    return false;
  }
});

module.exports = connectToMongoDB;
