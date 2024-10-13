// routes/enrollmentRoutes.js
const express = require("express");
const router = express.Router();
const Enrollment = require("../models/enrolle");

// Route to enroll a user
router.post("/enroll", async (req, res) => {
  const { card_id, email } = req.body;

  try {
    // Create a new enrollment
    const newEnrollment = new Enrollment({
      card_id,
      email,
    });

    // Save the enrollment
    await newEnrollment.save();

    res
      .status(201)
      .json({ message: "Enrollment successful", enrollment: newEnrollment });
  } catch (error) {
    // Handle the error for duplicate key (unique constraint violation)
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ error: "User has already enrolled in this course" });
    }

    console.error("Error enrolling user:", error);
    res.status(500).json({ error: "Failed to enroll user" });
  }
});

// Check if a user is already enrolled
router.post("/check-enrollment", async (req, res) => {
  const { card_id, email } = req.body;

  try {
    // Check if the enrollment already exists
    const existingEnrollment = await Enrollment.findOne({ card_id, email });

    if (existingEnrollment) {
      return res.json({ isEnrolled: true });
    } else {
      return res.json({ isEnrolled: false });
    }
  } catch (error) {
    console.error("Error checking enrollment:", error);
    res.status(500).json({ error: "Failed to check enrollment" });
  }
});

router.get('/enrollments/:email', async (req, res) => {
    const { email } = req.params;
    try {
      const enrollments = await Enrollment.find({ email: email });
      if (enrollments.length === 0) {
        return res.status(404).json({ success: false, message: "No enrollments found for this email." });
      }
  
      res.json({
        success: true,
        enrollments: enrollments,
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  
  
module.exports = router;
