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
        <div className="video-player" key={video.contentId}>
          <h3 className="video-title">{video.contentTitle}</h3>
          <MedalPlayer
            content={video}
            videoOpts={{
              autoplay: false,
              loop: false,
              muted: false,
              controls: true,
              embedded: true,
              retry: true
            }}
          />

          {/* Likes, comments, share section */}
          <div className="likes-comments-share">
            <div className="likes-comments">
              <p>
                <span>{video.likes}</span> likes
              </p>
              <p>
                <span>{video.comments}</span> comments
              </p>
              <p>
                <span>{video.views}</span> views
              </p>
            </div>

            <button className="share">Copy Link</button>
          </div>

          {/* Uploader section */}
          <div className="video-poster">
            <div style={{ display: "flex", alignItems: "center" }}>
              <Avatar thumbnail={video.poster.thumbnail} />
              <div className="uploader">
                <p>
                  uploaded by <span>{video.poster.displayName}</span>
                </p>
                <p>{video.poster.slogan}</p>
              </div>
            </div>
            <div className="uploader-stats">
              <p>
                <span>{video.poster.followers}</span> followers
              </p>
              <p>
                <span>{video.poster.upvotes}</span> upvotes
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
