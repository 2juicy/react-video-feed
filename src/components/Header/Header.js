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
        <button href="/">Home</button>
        <button href="#">My Clips</button>
        <button href="_blank">Support</button>
      </nav>
    </header>
  );
}
