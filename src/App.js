import React from "react";
import Header from "./components/Header/Header";
import Video from "./components/Video/Video";

function App() {
  return (
    <div className="App">
      <Header />
      <h1 className="page-title">Top Clips</h1>
      <Video />
    </div>
  );
}

export default App;
