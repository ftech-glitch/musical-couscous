import React, { useContext } from "react";
import Playlists from "./Playlists";
import UserContext from "../../context/user";
import "../Home.css";

function Home() {
  const userCtx = useContext(UserContext);
  return (
    <div className="home-container">
      <h1 className="home-greeting">{`Good Morning, ${userCtx.username}.`}</h1>
      <Playlists />
    </div>
  );
}

export default Home;
