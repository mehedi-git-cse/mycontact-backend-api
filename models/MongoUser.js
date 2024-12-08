const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    mongo_id: {
      type: String,
    },
    status: {
      type: Number,
    },
    is_archived: {
      type: Number,
    },
    image: {
      type: String,
    },
  },
  {
    collection: "users", // Specify the collection name explicitly
    timestamps: false, // Disable `createdAt` and `updatedAt` fields
  }
);

// Create the model
const MongoUser = mongoose.model("MongoUser", userSchema);

module.exports = MongoUser;
