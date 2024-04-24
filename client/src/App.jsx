import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Songs from "./pages/Songs";
import Album from "./pages/Album";
import Playlist from "./pages/Playlist";

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/songs" element={<Songs />} />
        <Route path="/albums" element={<Album />} />
        <Route path="/playlists" element={<Playlist />} />
      </Routes>
    </Router>
  );
};

export default App;
