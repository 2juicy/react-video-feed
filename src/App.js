import React from "react";
import Header from "./components/Header/Header";
import MedalPlayer from "medal-video-player";
import videos from "./videos.json";

function App() {
  console.log(videos);
  return (
    <div className="App">
      <Header />
      <main>
        <h1 style={{ textAlign: "center" }}>Main section</h1>
        <MedalPlayer
          content={videos[0]}
          user={videos[0].poster.displayName}
          videoRef={ref => (this.video = ref)}
          videoOpts={{
            autoplay: true, // should the video autoplay?
            loop: true, // should the video loop?
            muted: true, // is the video muted by default?
            controls: true, // are the video controls enabled?
            embedded: true, // is this an embedded player? should we include all branding components and enable player.js events?
            retry: true // if the video fails to load, for whatever reason, retry video.play() up to 10 times
          }}
        />
      </main>
    </div>
  );
}

export default App;
