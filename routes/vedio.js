const express = require("express");
const Posts = require("../models/assignment"); // Assuming you have a Video model
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Multer storage configuration for video upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store videos in 'client/src/Videos' folder
    if (file.fieldname === "video") {
      cb(null, path.join(__dirname, "../Vedios")); // Correct path for storing videos
    } else {
      cb(new Error("Invalid fieldname"), null); // Reject invalid fieldnames
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename based on timestamp
  },
});

const upload = multer({ storage: storage });

// Route for saving a video
router.post(
  "/video/save",
  upload.single("video"), // Handle a single video upload
  async (req, res) => {
    try {
      const { card_id, video_name } = req.body;

      // Check if all required fields are provided
      if (!card_id || !video_name || !req.file) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Store the video file path (filename)
      const videoPath = req.file.filename;

      // Create a new video post
      const newVideo = new Posts({
        card_id,
        video_name,
        video: videoPath, // Store the file name or relative path in the database
      });

      // Save the video to the database
      await newVideo.save();
      return res.status(200).json({ success: "Video saved successfully" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
);

// Get all videos with pagination
router.get("/video", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const startIndex = (page - 1) * limit;

    const videos = await Posts.find()
      .sort({ createdAt: -1 }) // Sort videos by creation date in descending order
      .skip(startIndex)
      .limit(limit)
      .exec(); // Get the latest videos first
    const totalVideos = await Posts.countDocuments();

    return res.status(200).json({
      success: true,
      existingVideos: videos,
      totalVideos,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// Get a specific video by ID
router.get("/video/:id", async (req, res) => {
  try {
    const videoId = req.params.id;
    const video = await Posts.findById(videoId).exec();
    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }
    return res.status(200).json({ success: true, video });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// Update video details
router.put("/video/update/:id", async (req, res) => {
  try {
    await Posts.findByIdAndUpdate(req.params.id, { $set: req.body });
    return res.status(200).json({ success: "Video updated successfully" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
