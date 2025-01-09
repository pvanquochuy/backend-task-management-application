import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    const dbURI =
      process.env.DB_URI || "mongodb://127.0.0.1:27017/task_manager";
    await mongoose.connect(dbURI);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

export default connectDatabase;
