import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import MusicPlayer from "./components/MusicPlayer";
import Home from "./pages/Home";
import AlbumsPage from "./pages/AlbumsPage";
import SearchPage from "./pages/SearchPage";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import UserContext from "./context/user";
import PlaylistsPage from "./pages/PlaylistsPage";
import PlaylistForm from "./pages/PlaylistForm";
import Playlists from "./pages/Playlists";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [role, setRole] = useState("");
  const [user_id, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [selectedSong, setSelectedSong] = useState(null);

  const handleSongSelect = (song) => {
    setSelectedSong(song);
  };

  return (
    <UserContext.Provider
      value={{ accessToken, setAccessToken, role, setRole, user_id, setUser }}
    >
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={<Login setShowLogin={setShowLogin} />}
          />
          <Route
            path="/register"
            element={<Registration setShowLogin={setShowLogin} />}
          />
          <Route path="/playlists" element={<Playlists />} />
          <Route
            path="/playlist/:playlist_id"
            element={
              <PlaylistsPage onSongSelect={(song) => setSelectedSong(song)} />
            }
          />
          <Route path="/playlist/new" element={<PlaylistForm />} />
          <Route
            path="/playlists/:playlist_id/edit"
            element={<PlaylistForm />}
          />

          <Route path="/albums" element={<AlbumsPage />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
        {accessToken.length > 0 && <MusicPlayer selectedSong={selectedSong} />}{" "}
      </Router>
    </UserContext.Provider>
  );
}

export default App;
