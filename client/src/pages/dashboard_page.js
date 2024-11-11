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
import Chanel from "../chanel/chanel";
import Mychenal from "../chanel/mychenal";
import Chart from "../components/analatic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGraduate,
  faSearch,
  faCalendarAlt,
  faGift,
  faPlusCircle,
  faFolderOpen,
  faYoutube,
  faTv,
} from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const [isGiftCardOpen, setIsGiftCardOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [profileSummary, setProfileSummary] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await authService.getUserData();
        setEmail(userData.email);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (email) {
      const fetchProfileSummary = async () => {
        try {
          const response = await axios.get(
            `http://localhost:9001/userprofile/summary/${email}`
          );
          setProfileSummary(response.data);
        } catch (error) {
          console.error("Failed to fetch profile information", error);
        }
      };
      fetchProfileSummary();
    }
  }, [email]);

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
            <Link to="/dashboard/analytics">
              <FontAwesomeIcon icon={faUserGraduate} /> Analytics
            </Link>
          </li>
          <li>
            <Link to="/dashboard/myenrollment">
              <FontAwesomeIcon icon={faUserGraduate} /> My Enrollment
            </Link>
          </li>
          <li>
            <Link to="/dashboard/mychenal">
              <FontAwesomeIcon icon={faTv} /> My Chanel
            </Link>
          </li>
          <li>
            <Link to="/dashboard/search">
              <FontAwesomeIcon icon={faSearch} /> Search Module
            </Link>
          </li>
          <li>
            <Link to="/dashboard/calender">
              <FontAwesomeIcon icon={faCalendarAlt} /> Calendar
            </Link>
          </li>
        </ul>
        <button className="open-modal-btn" onClick={openGiftCardModal}>
          <FontAwesomeIcon icon={faGift} /> Open Gift Card
        </button>
        <hr />
        <ul>
          <li>
            <Link to="/dashboard/create_card">
              <FontAwesomeIcon icon={faPlusCircle} /> Create Module
            </Link>
          </li>
          <li>
            <Link to="/dashboard/my_modules">
              <FontAwesomeIcon icon={faFolderOpen} /> My Creation
            </Link>
          </li>
          <li>
            <Link to="/dashboard/chenal">
              <FontAwesomeIcon icon={faTv} /> Create chanel
            </Link>
          </li>
        </ul>
      </aside>

      <main className="main-content">
        <Routes>
          <Route path="/create_card" element={<Create />} />
          <Route path="/search" element={<Search />} />
          <Route path="*" element={<Navigate to="/dashboard/analytics" />} />
          <Route path="/myenrollement" element={<Enroll />} />
          <Route path="/analytics" element={<Chart />} />
          <Route path="/my_modules" element={<MyModule />} />
          <Route path="/calender" element={<Calender />} />
          <Route path="/chenal" element={<Chanel />} />
          <Route path="/mychenal" element={<Mychenal />} />
        </Routes>
      </main>

      {isGiftCardOpen && <GiftCard closeModal={closeGiftCardModal} />}
    </div>
  );
};

export default Dashboard;
