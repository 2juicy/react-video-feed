import React from "react";
import "./VideoNav.css";

export default function VideoNav() {
  return (
    <div className="video-navbar">
      <div className="video-routes">
        <a
          href="https://site.medal.tv/"
          target="_blank"
          rel="noopener noreferrer"
        >
          About
        </a>
        <a href="https://medal.tv/" target="_blank" rel="noopener noreferrer">
          Trending
        </a>
        <a
          href="https://medal.tv/all"
          target="_blank"
          rel="noopener noreferrer"
        >
          Browse
        </a>
        <a
          href="https://medal.tv/discord"
          target="_blank"
          rel="noopener noreferrer"
        >
          Discord
        </a>
      </div>

      <input id="video-search" label="Search" placeholder="Search" />
    </div>
  );
}
