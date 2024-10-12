const express = require("express");
const Posts = require("../models/profile");
const multer = require("multer");
const path = require("path");

const routerrees = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "image") {
      cb(null, path.join(__dirname, "../Profile")); // Adjust this path to your project structure
    } else {
      cb(new Error("Invalid fieldname"), null);
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Name file with timestamp
  },
});

const upload = multer({ storage: storage });

// Route to save new profile with image
routerrees.post(
  "/profile/save",
  upload.fields([{ name: "image", maxCount: 1 }]),
  async (req, res) => {
    try {
      const { first_name, last_name, email, phone, DOB, job, about } = req.body;

      // Validate required fields
      if (!first_name || !last_name || !email || !phone || !job || !DOB || !about) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Get image path from uploaded file
      const imagePath = req.files["image"] ? req.files["image"][0].filename : null;

      // Create new profile
      const newPost = new Posts({
        first_name,
        last_name,
        email,
        phone,
        DOB,
        job,
        about,
        image: imagePath,
      });

      await newPost.save();
      return res.status(200).json({ success: "Profile saved successfully" });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
);

// Route to get profile by email
routerrees.get("/profiles", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    const userProfile = await Posts.findOne({ email });

    if (!userProfile) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      userProfile,
    });
  } catch (error) {
    console.error("Error fetching user profile:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Route to get profile by ID
routerrees.get("/profile/:id", async (req, res) => {
  try {
    const postId = req.params.id;

    const post = await Posts.findById(postId).exec();
    if (!post) {
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    return res.status(200).json({ success: true, post });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// Route to update profile by email, with optional image upload
routerrees.put(
  "/profile/update/email",
  upload.single("image"), // Handle image upload during update
  async (req, res) => {
    try {
      const { email, first_name, last_name, phone, DOB, job, about } = req.body;

      // Validate email is provided
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      // Prepare data to update
      const updateData = {};
      if (first_name) updateData.first_name = first_name;
      if (last_name) updateData.last_name = last_name;
      if (phone) updateData.phone = phone;
      if (DOB) updateData.DOB = DOB;
      if (job) updateData.job = job;
      if (about) updateData.about = about;

      // If a new image is uploaded, update the image field
      if (req.file) {
        updateData.image = req.file.filename;
      }

      // Update the profile based on the email
      const updatedPost = await Posts.findOneAndUpdate(
        { email },
        { $set: updateData },
        { new: true } // Return the updated document
      );

      if (!updatedPost) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      return res.status(200).json({
        success: "Profile updated successfully",
        updatedPost,
      });
    } catch (error) {
      console.error("Error updating profile:", error.message);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Route to get user profile summary (e.g., count students and admins)
routerrees.get("/userprofile/summary", async (req, res) => {
  try {
    const totalStudents = await Posts.countDocuments({ job: "Student" });
    const totalAdmins = await Posts.countDocuments({
      job: { $in: ["Teacher", "Lecturer"] },
    });

    return res.status(200).json({
      success: true,
      totalStudents,
      totalAdmins,
    });
  } catch (error) {
    console.error("Error fetching user summary:", error);
    return res.status(500).json({ error: "Server error, please try again" });
  }
});

module.exports = routerrees;
