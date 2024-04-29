import React from "react";
import Playlists from "./Playlists";
import "../Home.css";

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-greeting">Good Morning.</h1>
      <Playlists />
    </div>
  );
}

export default Home;
