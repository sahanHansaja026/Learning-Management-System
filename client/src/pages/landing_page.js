import React, { Component } from "react";
import "../css/landin.css";
import Hero from "../images/hero.png";
import Teacher from "../images/teacher.png";
import Parents from "../images/parents.png";
import Student from "../images/student.png";

export default class landing_page extends Component {
  render() {
    return (
      <div className="landin">
        <div className="herobox">
          <div className="content">
            <h1>ModuleMate</h1>
            <p>
              Reflects the idea of a global education space where everyone can
              learn.
            </p>
          </div>
          <div className="heroimage">
            <img src={Hero} alt="Example" />
          </div>
        </div>
        <div className="char">
          <div className="charbox1">
            <h2>For Teachers</h2>
            <p>
              Create engagingmodules with videos, assignments, and
              quizzes.Manage your students’ progress and grade their work- all
              in one place.
            </p>
            <button><a href="/login">Start Teaching</a></button>
          </div>

          <div className="charbox2">
            <h2>For Students</h2>
            <p>
              Access a world of learning. Complete assignments, watch videos,
              and take quizzes at your own pace, with feedback from your
              teacher.
            </p>
            <button><a href="/login">For Students</a></button>
          </div>

          <div className="charbox3">
            <h2>For Parents</h2>
            <p>
              Stay connected to your child’s learning journey. Monitor their
              progress, assignments, and grades, and support their growth
            </p>
            <button><a href="/login">For Parents</a></button>
          </div>
        </div>
        <div className="box1">
          <div className="subbox1">
            <h2>Create and Manage Modules</h2>
            <p>
              Teachers have the power to design interactive learning modules
              tailored to their students' needs. Easily upload videos,
              assignments, PDFs, and quizzes, all while tracking student
              performance. Whether you're teaching a class or offering extra
              tutoring, our platform makes it simple to manage and grade
              content, giving you more time to focus on teaching.
            </p>
          </div>
          <div className="subimg">
            <img src={Teacher} alt="Example" />
          </div>
        </div>

        <div className="box2">
          <div className="subimg">
            <img src={Student} alt="Example" />
          </div>
          <div className="subbox2">
            <h2>Learn and Track Your Progress</h2>
            <p>
              Students can dive into modules created by their teachers,
              exploring videos, assignments, and quizzes in an interactive
              learning environment. Track your progress through each lesson,
              submit your assignments, and see your grades in real-time.
              Learning has never been easier—study at your own pace, wherever
              you are, and receive personalized feedback from your teacher.
            </p>
          </div>
        </div>

        <div className="box1">
          <div className="subbox1">
            <h2>Monitor and Support Your Child</h2>
            <p>
              Parents play a crucial role in their child's learning journey.
              Stay informed and involved by monitoring your child’s performance,
              assignments, and grades on the platform. With access to their
              progress reports and learning milestones, you can offer timely
              support and ensure they stay on track for success
            </p>
          </div>
          <div className="subimg">
            <img src={Parents} alt="Example" />
          </div>
        </div>
      </div>
    );
  }
}
