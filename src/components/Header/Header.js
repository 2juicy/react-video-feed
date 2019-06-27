import React from "react";
import "./Header.css";

export default function Header() {
  return (
    <header id="header-component">
      <div className="header-title">
        <a href="/">
          <img alt="MedalTV" src="assets/logo.jpg" />
          <div>
            <h1>Medal</h1>
          </div>
        </a>
      </div>
      <nav id="header-nav">
        <a href="#">Home</a>
        <a href="#">My Clips</a>
        <a href="#">Support</a>
      </nav>
    </header>
  );
}
