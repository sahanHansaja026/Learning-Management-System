import React, { Component } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Landing_Page from "./pages/landing_page";
import NavBar from "./components/navbar";
import Login from "./pages/login_page";
import Regestar from "./pages/register_page";
import Profile from "./pages/profile";
import Home from "./pages/home_page";
import Dashboard from "./pages/dashboard_page";
import Teacherweek from "./components/teacherweek";
import AddPage from "./components/Add";
import Assingment from "./components/assingment";
import Note from "./components/note";
import Video from "./components/video";
import Search from "./pages/search";
import CreateQuiz from "./components/create_quiz";
import Create from "./components/create";
import Quiz from "./components/quiz";
import Score from "./components/score";

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
        <Route exact path="/search" element={<Search/>}/>
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route exact path="/teacherweek/:id" element={<Teacherweek />} />
        <Route exact path="/add/:id" element={<AddPage />} />
        <Route exact path="/add_assingment/:id" element={<Assingment />} />
        <Route exact path="/add_note/:id" element={<Note />} />
        <Route exact path="/add_vedio/:id" element={<Video />} />
        <Route exact path="/add_quiz/:id" element={<CreateQuiz />} />
        <Route exact path="/create/:quizId" element={<Create />} />
        <Route exact path="/quiz/:quizId" element={<Quiz />} />
        <Route exact path="/score/:quizId" element={<Score />} />
      </Routes>
    </div>
  );
};
export default () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
