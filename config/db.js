const mongoose = require("mongoose");
const User = require("../models/User");

const MONGO_URI = "mongodb+srv://adisonsalauddin:LnFxf1IzfgnX3asv@cluster0.uzgey.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected !");
    await User.createCollection();
    console.log("User collection created successfully");
  } catch (err) {
    console.log("not connected !!" + err.message);
    process.exit(1)
  }
};

connectDB();

module.exports = connectDB;