import React, { useContext } from "react";
import Albums from "./Albums";
import UserContext from "../../context/user";
import "../Home.css";

function Home() {
  const userCtx = useContext(UserContext);

  // Determine the username, defaulting to "Guest" if not logged in
  const username = userCtx.isLoggedIn ? userCtx.username : "Guest";

  return (
    <div className="home-container">
      <h1 className="home-greeting">{`Good Morning, ${username}.`}</h1>

      {userCtx.isLoggedIn && <Albums />}
    </div>
  );
}

export default Home;
