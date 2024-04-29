import React from "react";
import Albums from "./Albums";
import "../Home.css";

function Home() {
  return (
    <div className="home-container">
      <h1 className="home-greeting">Good Morning.</h1>
      <Albums />
    </div>
  );
}

export default Home;
