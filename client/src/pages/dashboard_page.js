// src/components/Dashboard.js
import React, { useState } from "react";
import { Link, Route, Routes, Navigate } from "react-router-dom";
import "../css/dashboard.css";
import GiftCard from "../components/GiftCard"; 
import Create from "../components/create_card";

const Dashboard = () => {
  const [isGiftCardOpen, setIsGiftCardOpen] = useState(false);

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
            <Link to="/dashboard/create_card">Create Module</Link>
          </li>
        </ul>
        {/* Button to open the gift card modal */}
        <button className="open-modal-btn" onClick={openGiftCardModal}>
          Open Gift Card
        </button>
      </aside>

      <main className="main-content">
        <Routes>
          <Route path="/create_card" element={<Create />} />
        </Routes>
      </main>

      {/* Render the GiftCard modal when the state is true */}
      {isGiftCardOpen && <GiftCard closeModal={closeGiftCardModal} />}
    </div>
  );
};

export default Dashboard;
