import React from "react";
import Header from "./components/Header/Header";
import VideoNav from "./components/VideoNav/VideoNav";
import Video from "./components/Video/Video";

function App() {
  return (
    <div className="App">
      <Header />
      <VideoNav />
      <h2 className="page-title">Trending Clips</h2>
      <Video />
      <button onClick={() => window.scrollTo(0, 0)} className="top">
        Back to Top
      </button>
    </div>
  );
}

export default App;
