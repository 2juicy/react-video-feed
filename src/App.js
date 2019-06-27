import React from "react";
import Header from "./components/Header/Header";
import Video from "./components/Video/Video";

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <h1 style={{ textAlign: "center" }}>Trending Clips</h1>
        <Video />
      </main>
    </div>
  );
}

export default App;
