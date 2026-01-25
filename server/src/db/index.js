import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected To Database");
  } catch (error) {
    console.log("Connection Failed", error);
    process.exit(1);
  }
};

export default connectDB;
