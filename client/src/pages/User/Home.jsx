import React, { useContext, useState, useEffect } from "react";
import Playlists from "./Playlists";
import UserContext from "../../context/user";
import "../Home.css";

function Home({ isLoggedIn }) {
  const userCtx = useContext(UserContext);

  // Determine the username, defaulting to "Guest" if not logged in
  const username = userCtx.isLoggedIn ? userCtx.username : "Guest";

  return (
    <div className="home-container">
      <h1 className="home-greeting">{`Good Morning, ${username}.`}</h1>
      {userCtx.isLoggedIn && <Playlists />}
    </div>
  );
}

export default Home;
