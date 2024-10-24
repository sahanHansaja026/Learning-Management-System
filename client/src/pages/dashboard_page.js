import React, { useState, useEffect } from "react";
import { Link, Route, Routes, Navigate } from "react-router-dom";
import "../css/dashboard.css";
import GiftCard from "../components/GiftCard";
import Create from "../components/create_card";
import Search from "../components/search";
import authService from "../services/authService";
import axios from "axios";
import Enroll from "../components/my_enrollement";
import MyModule from "../components/my_module";
import Calender from "../components/calender";

const Dashboard = () => {
  const [isGiftCardOpen, setIsGiftCardOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [profileSummary, setProfileSummary] = useState(null);

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await authService.getUserData(); // Adjust path as necessary
        setEmail(userData.email);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };
    fetchUserData();
  }, []);

  // Fetch profile summary based on the email
  useEffect(() => {
    if (email) {
      const fetchProfileSummary = async () => {
        try {
          const response = await axios.get(
            `http://localhost:9001/userprofile/summary/${email}`
          );
          setProfileSummary(response.data); // Save the profile information
        } catch (error) {
          console.error("Failed to fetch profile information", error);
        }
      };
      fetchProfileSummary();
    }
  }, [email]); // This effect will run when the email is set

  const openGiftCardModal = () => {
    setIsGiftCardOpen(true);
  };

  const closeGiftCardModal = () => {
    setIsGiftCardOpen(false);
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>Dashboard</h2>
        <ul>
          <li>
            <Link to="/dashboard/myenrollment">My Enrollment</Link>
          </li>
          <li>
            <Link to="/dashboard/search">Search Module</Link>
          </li>
          <li>
            <Link to ="/dashboard/calender">Calender</Link>
          </li>
        </ul>
        {/* Button to open the gift card modal */}
        <button className="open-modal-btn" onClick={openGiftCardModal}>
          Open Gift Card
        </button>
        <hr />
        <ul>
          <li>
            <Link to="/dashboard/create_card">Create Module</Link>
          </li>
          <li>
            <Link to="/dashboard/my_modules">My Modules</Link>
          </li>
        </ul>
      </aside>

      <main className="main-content">
        <Routes>
          <Route path="/create_card" element={<Create />} />
          <Route path="/search" element={<Search />} />
          <Route path="*" element={<Navigate to="/dashboard/myenrollment" />} />
          <Route path="/myenrollment" element={<Enroll />} />
          <Route path="/my_modules" element={<MyModule />} />
          <Route path="/calender" element={<Calender/>}/>
        </Routes>
      </main>

      {/* Render the GiftCard modal when the state is true */}
      {isGiftCardOpen && <GiftCard closeModal={closeGiftCardModal} />}
    </div>
  );
};

export default Dashboard;
