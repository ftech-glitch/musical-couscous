import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "./../hooks/useFetch";
import UserContext from "./../context/user";

const Search = ({ onSongSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    songs: [],
    playlists: [],
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);

  const navigate = useNavigate();

  const handleSearch = async (event) => {
    event.preventDefault();

    try {
      const res = await fetchData(
        `/search?search=${encodeURIComponent(searchQuery)}`,
        "GET",
        undefined,
        userCtx.accessToken
      );

      if (res.ok) {
        setSearchResults(res.data);
        setErrorMessage(null);
      } else {
        setErrorMessage(res.data?.message || "Error executing search query");
      }
    } catch (error) {
      setErrorMessage("Error executing search query");
    }
  };

  const handleSongClick = (song) => {
    if (onSongSelect) {
      onSongSelect(song); // Trigger the music player to play the song
    }
  };

  const handlePlaylistClick = (playlist_id) => {
    navigate(`/playlist/${playlist_id}`); // Navigate to the specific playlist
  };

  return (
    <div>
      <h2>Search</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <h3>Song Results</h3>
      <ul>
        {searchResults.songs.map((song) => (
          <li key={song.song_id}>
            <button onClick={() => handleSongClick(song)}>{song.title}</button>
          </li>
        ))}
      </ul>

      <h3>Playlist Results</h3>
      <ul>
        {searchResults.playlists.map((playlist) => (
          <li key={playlist.playlist_id}>
            <button onClick={() => handlePlaylistClick(playlist.playlist_id)}>
              {playlist.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Search;
