import React from "react";
import "./Header.css";

export default function Header() {
  return (
    <header id="header-component">
      <div className="header-title">
        <a href="/#">
          <img alt="MedalTV" src="assets/logo.jpg" />
          <div>
            <h1>Medal</h1>
          </div>
        </a>
      </div>
      {/* Use react router here */}
      <nav id="header-nav">
        <a href="/#">Login</a>
        <a href="https://medal.tv/download">Sign Up</a>
      </nav>
    </header>
  );
}
