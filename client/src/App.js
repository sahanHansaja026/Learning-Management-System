import React, { Component } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Landing_Page from "./pages/landing_page";
import NavBar from "./components/navbar";
import Login from "./pages/login_page";
import Regestar from "./pages/register_page";
import Profile from "./pages/profile";
import Home from "./pages/home_page";

const App = () => {
  const location = useLocation();

  const noNavBarPaths = ["/","/login","/registar"];
  return (
    <div className="container">
      {!noNavBarPaths.includes(location.pathname) && <NavBar />}
      <Routes>
        <Route exact path="/" element={<Landing_Page />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/registar" element={<Regestar/>}/>
        <Route exact path="/profile" element={<Profile/>}/>
        <Route exact path="/home" element={<Home/>}/>
      </Routes>
    </div>
  );
};
export default () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
