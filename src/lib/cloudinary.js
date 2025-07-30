import { v2 as cloundinary } from "cloudinary";
import "dotenv/config";
cloundinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY ,
  api_secret: process.env.CLOUD_SECRET,
});
export default cloundinary;
