import React, { Component } from "react";
import Hero from "../images/hero.png";
import "../css/home.css";

export default class home_page extends Component {
  render() {
    return (
      <div className="home">
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
      </div>
    );
  }
}
