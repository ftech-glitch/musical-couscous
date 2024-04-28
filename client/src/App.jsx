import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import MusicPlayer from "./components/MusicPlayer";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import UserContext from "./context/user";
import PlaylistsPage from "./pages/User/PlaylistsPage";
import PlaylistForm from "./pages/User/PlaylistForm";
import Playlists from "./pages/User/Playlists";
import UserHome from "./pages/User/Home";
import ArtistHome from "./pages/Artist/Home";
import Albums from "./pages/Artist/Albums";
import AlbumsPage from "./pages/Artist/AlbumsPage";
import AlbumForm from "./pages/Artist/AlbumForm";
import AddSong from "./pages/Artist/AddSong";
import Box from "@mui/material/Box";
import Search from "./pages/Search";
import AddSongToPlaylistPage from "./pages/User/AddSongToPlaylistPage";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [role, setRole] = useState("");
  const [user_id, setUser] = useState(null);
  const [artist_id, setArtist] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [selectedSong, setSelectedSong] = useState(null);

  const handleSongSelect = (song) => {
    setSelectedSong(song);
  };

  return (
    <UserContext.Provider
      value={{
        accessToken,
        setAccessToken,
        role,
        setRole,
        user_id,
        setUser,
        artist_id,
        setArtist,
      }}
    >
      <Router>
        <NavBar role={role} />
        <Box sx={{ ml: 30, padding: 2 }}>
          <Routes>
            <Route path="/" element={<Login setShowLogin={setShowLogin} />} />
            <Route
              path="/register"
              element={<Registration setShowLogin={setShowLogin} />}
            />
            <Route
              path="/search"
              element={
                <Search onSongSelect={(song) => setSelectedSong(song)} />
              }
            />

            {/* user routes */}
            <Route path="/userhome" element={<UserHome />} />
            <Route path="/playlists" element={<Playlists />} />
            <Route
              path="/playlist/:playlist_id"
              element={
                <PlaylistsPage onSongSelect={(song) => setSelectedSong(song)} />
              }
            />
            <Route path="/playlist/new" element={<PlaylistForm />} />
            <Route
              path="/playlist/:playlist_id/add-song"
              element={<AddSongToPlaylistPage />}
            />

            {/* artist routes */}
            <Route path="/artisthome" element={<ArtistHome />} />
            <Route path="albums" element={<Albums />} />
            <Route
              path="/album/:album_id"
              element={
                <AlbumsPage onSongSelect={(song) => setSelectedSong(song)} />
              }
            />
            <Route path="/album/new" element={<AlbumForm />} />
            <Route path="/album/:album_id/add-song" element={<AddSong />} />
          </Routes>
          {accessToken.length > 0 && (
            <MusicPlayer selectedSong={selectedSong} />
          )}{" "}
        </Box>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
