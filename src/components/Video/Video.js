import React, { useState, useEffect } from "react";
import "./Video.css";
import MedalPlayer from "medal-video-player";
import Avatar from "../Avatar/Avatar";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function Video({ results }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setVideos(results.slice(0, 10));
  }, [results]);

  useEffect(() => {
    if (videos.length < 50) {
      window.addEventListener("scroll", handleScroll);
    }
    return () => window.removeEventListener("scroll", handleScroll);
  });

  useEffect(() => {
    if (!loading) return;
    setVideos(prev => [
      ...prev,
      ...results.slice(prev.length, 10 + prev.length)
    ]);
    setLoading(false);
  }, [loading, results]);

  function handleScroll() {
    if (
      window.innerHeight + window.pageYOffset + 100 <
      document.documentElement.offsetHeight
    ) {
      return;
    } else setLoading(true);
  }

  return (
    <div className="video-wrapper">
      {videos.map(video => (
        <div className="video-player" key={video.contentId}>
          <h3 className="video-title">{video.contentTitle}</h3>
          <MedalPlayer
            content={video}
            user={video.poster}
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
            <CopyToClipboard text={`https://medal.tv/clips/${video.contentId}`}>
              <button className="share">Copy Link</button>
            </CopyToClipboard>
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

      <div style={{ textAlign: "center", marginBottom: "1em" }}>
        <button onClick={() => window.scrollTo(0, 0)} className="top">
          Back to Top
        </button>
      </div>
    </div>
  );
}
