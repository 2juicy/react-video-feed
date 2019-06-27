import React from "react";
import "./Video.css";
// Without a backend to make API calls we pull the .json file with import.
import videos from "../../videos.json";
import MedalPlayer from "medal-video-player";
import Avatar from "../Avatar/Avatar";

export default function Video() {
  return (
    <div className="video-wrapper">
      {videos.map(video => (
        <div className="video-player">
          <Avatar thumbnail={video.poster.thumbnail} />
          <h3 className="video-title">{video.contentTitle}</h3>
          <MedalPlayer
            content={video}
            user={video.poster.displayName}
            videoOpts={{
              autoplay: false,
              loop: true,
              muted: true,
              controls: true,
              embedded: true,
              retry: true
            }}
          />
        </div>
      ))}
    </div>
  );
}
