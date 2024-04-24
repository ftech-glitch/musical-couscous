import React from "react";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/songs">Songs</Link>
        </li>
        <li>
          <Link to="/albums">Albums</Link>
        </li>
        <li>
          <Link to="/playlists">Playlists</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
