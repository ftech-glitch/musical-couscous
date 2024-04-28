import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import MusicPlayer from "./components/MusicPlayer";
import Home from "./pages/Home";
import PlaylistsPage from "./pages/PlaylistsPage";
import AlbumsPage from "./pages/AlbumsPage";
import SearchPage from "./pages/SearchPage";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import UserContext from "./context/user";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [role, setRole] = useState("");
  const [showLogin, setShowLogin] = useState(true);

  return (
    <UserContext.Provider
      value={{ accessToken, setAccessToken, role, setRole }}
    >
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/albums" element={<AlbumsPage />} />
          <Route path="/playlists" element={<PlaylistsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route
            path="/login"
            element={<Login setShowLogin={setShowLogin} />}
          />
          <Route
            path="/register"
            element={<Registration setShowLogin={setShowLogin} />}
          />
        </Routes>
        {/* {accessToken.length > 0 && <Home></Home>}
        {accessToken.length === 0 && showLogin && (
          <Login setShowLogin={setShowLogin}></Login>
        )}
        {accessToken.length === 0 && !showLogin && (
          <Registration setShowLogin={setShowLogin}></Registration>
        )} */}
        {accessToken.length > 0 && <MusicPlayer />}{" "}
      </Router>
    </UserContext.Provider>
  );
}

export default App;
