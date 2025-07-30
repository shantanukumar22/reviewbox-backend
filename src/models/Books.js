import mongoose from "mongoose";
const BookSchema = new mongoose.Schema(
  {
    title: {
      required: true,
      type: String,
    },
    caption: {
      required: true,
      type: String,
    },
    image: {
      required: true,
      type: String,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", BookSchema);

export default Book;
