import express from "express";
import cloundinary from "../lib/cloudinary.js";
import Book from "../models/Books.js";
import protectedRoute from "../middleware/auth.middleware.js";
const router = express.Router();

//* posting the book recommendation
router.post("/", protectedRoute, async (req, res) => {
  try {
    const { title, caption, image, rating } = req.body;
    if (!title || !caption || !image || !rating) {
      return res.status(400).json({ message: "Please provide all the fields" });
    }
    const uploadResponse = await cloundinary.uploader.upload(image);
    const image_url = uploadResponse.secure_url;
    const newBook = Book({
      title,
      caption,
      image: image_url,
      rating,
      user: req.user._id,
    });

    await newBook.save();
    res.status(200).json(newBook);
  } catch (error) {
    console.log("error creating the book", error);
    res.status(500).json({ error: error.message });
  }
});
//?  getting all the books
router.get("/", protectedRoute, async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;
    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "username profileImage ");
    const totalbooks = Book.countDocuments();
    res.send({
      books,
      currentPage: page,
      totalBooks: totalbooks,
      totalPages: Math.ceil(totalbooks / limit),
    });
  } catch (error) {
    console.log("error fetching books", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

//!deleting the book recommendation
try {
  router.delete("/:id", protectedRoute, async (req, res) => {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "book is not found" });
    }
    // check if user is the creator of the book
    if (book.user.toString() !== req.user._id.toString())
      return res
        .status(401)
        .json({ message: "unauthorized to delete the book" });

    router.get("/user", protectedRoute, async (req, res) => {
      try {
        const books = await Book.find({ user: req.user._id }).sort({
          createdAt: -1,
        });
        res.json(books);
      } catch (error) {
        console.error("Get user books error:", error.message);
        res.status(500).json({ message: "Server error" });
      }
    });
    //? deleting the book also from the cloudinary
    if (book.image && book.image.includes("cloudinary")) {
      try {
        const publicId = book.image.split("/").pop().split(".")[0];
        await cloundinary.uploader.destroy(publicId);
      } catch (deleteError) {
        console.log("Error deleting image from cloudinary", deleteError);
      }
    }
    await book.deleteOne();
    res.json({ message: "book is deleted successfully" });
  });
} catch (error) {
  res
    .status(500)
    .json({ message: "can not perform the specific action for now" });
}
export default router;
