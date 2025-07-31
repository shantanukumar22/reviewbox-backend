import express from "express";
import "dotenv/config";
import cors from "cors";
const app = express();
import authRoutes from "./routes/authRoutes.js";
import booksRoutes from "./routes/booksRoutes.js";
import { connectDB } from "../src/lib/db.js";
import job from "./lib/cron.js";
const PORT = process.env.PORT || 3000;
job.start();
app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/books", booksRoutes);
app.get("/", (req, res) => {
  res.json("backend working correctly");
});
app.listen(PORT, () => {
  console.log(`port is running on  ${PORT}`);
  connectDB();
});
