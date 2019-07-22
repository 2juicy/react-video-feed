import React, { useState, useEffect } from "react";
import Header from "./components/Header/Header";
import VideoNav from "./components/VideoNav/VideoNav";
import Video from "./components/Video/Video";

function App() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    (async function() {
      let res = await fetch("videos.json");
      let json = await res.json();
      setResults(json);
    })();
  }, []);

  return (
    <div className="App">
      <Header />
      <VideoNav />
      <h2 className="page-title">Trending Clips</h2>
      <Video results={results} />
    </div>
  );
}

export default App;
