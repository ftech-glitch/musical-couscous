import React, { useContext } from "react";
import Albums from "./Albums";
import UserContext from "../../context/user";
import "../Home.css";

function Home() {
  const userCtx = useContext(UserContext);
  return (
    <div className="home-container">
      <h1 className="home-greeting">{`Good Morning, ${userCtx.username}.`}</h1>
      <Albums />
    </div>
  );
}

export default Home;
