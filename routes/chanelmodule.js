const express = require("express");
const Posts = require("../models/chanelmodule");
const multer = require("multer");
const path = require("path");

const routers = express.Router();

// Upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../Uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Save post
routers.post("/chenelsposts/save", upload.single("image"), async (req, res) => {
  try {
    const { email, owneremail, card_id, title, summery } = req.body;

    if (!email || !card_id || !owneremail || !title || !summery || !req.file) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const imagePath = req.file.filename;

    const newPost = new Posts({
      email,
      owneremail,
      title,
      summery,
      card_id,
      image: imagePath,
    });

    await newPost.save();
    return res.status(200).json({ success: "Post saved successfully" });
  } catch (error) {
    console.error("Error saving post:", error);
    return res.status(500).json({ error: "Server error, please try again" });
  }
});

// Get all posts
routers.get("/chenalposts", async (req, res) => {
  try {
    const posts = await Posts.find().sort({ _id: -1 }).exec();
    return res.status(200).json({
      success: true,
      existingPosts: posts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ error: "Server error, please try again" });
  }
});

// get a specific post by ID
routers.get("/chenalpost/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Posts.findById(postId).exec();
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }
    return res.status(200).json({ success: true, post });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

//get a count
routers.get("/chenalposts/count", async (req, res) => {
  try {
    const count = await Posts.countDocuments();
    return res.status(200).json({
      success: true,
      count: count,
    });
  } catch (error) {
    console.error("Error fetching post count:", error);
    return res.status(500).json({ error: "Server error, please try again" });
  }
});

routers.get("/chenalpostes/:card_id", async (req, res) => {
  try {
    const cardId = req.params.card_id;
    console.log("Card ID received:", cardId); // Log the card_id for debugging

    // Fetching posts related to card_id and sorting by createdAt (descending)
    const posts = await Posts.find({ card_id: cardId })
      .sort({ createdAt: -1 })
      .exec();

    console.log("Posts found:", posts); // Log the results for debugging

    if (!posts || posts.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No posts found", posts: [] });
    }

    return res.status(200).json({ success: true, post: posts[0] }); // Return only the first post
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

// Get posts by email (using URL parameter)
// routers.get("/posts/:email", async (req, res) => {
routers.get("/chenalposts/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10

    const skip = (page - 1) * limit; // Calculate how many documents to skip

    // Find posts by email with pagination
    const posts = await Posts.find({ email: email })
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ _id: -1 }) // Sort by most recent
      .exec();

    // Count total posts to calculate total pages
    const totalPosts = await Posts.countDocuments({ email: email });

    return res.status(200).json({
      success: true,
      existingPosts: posts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
    });
  } catch (error) {
    console.error("Error fetching posts by email:", error);
    return res.status(500).json({ error: "Server error, please try again" });
  }
});

module.exports = routers;
