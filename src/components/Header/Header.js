import React from "react";
import "./Header.css";

export default function Header() {
  return (
    <header id="header-component">
      <div className="header-title">
        <a href="#0">
          <img alt="MedalTV" src="assets/logo.jpg" />
          <div>
            <h1>Medal</h1>
          </div>
        </a>
      </div>
      {/* Use react router here */}
      <nav id="header-nav">
        <a href="#0">Login</a>
        <a
          href="https://medal.tv/download"
          target="_blank"
          rel="noopener noreferrer"
        >
          Sign Up
        </a>
      </nav>
    </header>
  );
}
