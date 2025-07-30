import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("database connected");
  } catch (error) {
    console.log("error connecting to the database");
    process.exit(1); //exit with failure
  }
};
 