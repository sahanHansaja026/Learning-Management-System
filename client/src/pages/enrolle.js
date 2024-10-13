import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import axios from "axios";
import "../css/enrolle.css"; // Import the CSS file

const Enrolle = ({ setCardId }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { id } = useParams();
  const navigate = useNavigate(); // React Router's navigate function

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await authService.getUserData();
        setEmail(userData.email);

        // Check if the user is already enrolled
        const enrollmentData = {
          card_id: id,
          email: userData.email,
        };

        const response = await axios.post(
          "http://localhost:9001/check-enrollment",
          enrollmentData
        );

        if (response.data.isEnrolled) {
          // If already enrolled, redirect to /teacherweek/${id}
          navigate(`/teacherweek/${id}`);
        }
      } catch (error) {
        console.error("Failed to fetch user data or check enrollment", error);
      }
    };

    fetchUserData();
  }, [id, navigate]);

  useEffect(() => {
    if (setCardId) {
      setCardId(id);
    }
  }, [id, setCardId]);

  const handleEnrollClick = async () => {
    try {
      const enrollmentData = {
        card_id: id,
        email: email,
      };

      await axios.post("http://localhost:9001/enroll", enrollmentData);
      setMessage("Enrollment successful");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage("You have already enrolled in this course.");
        // Redirect to /teacherweek/${id} if already enrolled
        navigate(`/teacherweek/${id}`);
      } else {
        setMessage("Failed to enroll. Please try again later.");
      }
    }
  };

  return (
    <div className="enrolle-container">
      {/*<h1>Enrolle page</h1>
      <p>Your card ID is: {id}</p>
  <p>Your email: {email}</p>*/}
      <p className="message">{message}</p>
      <button onClick={handleEnrollClick}>Enroll</button> {/* Enroll Button */}
    </div>
  );
};

export default Enrolle;
