import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "./../hooks/useFetch";
import UserContext from "./../context/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

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
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      {/* <h2
        style={{ fontSize: "24px", color: "whitesmoke", textAlign: "center" }}
      >
        Search Music
      </h2> */}
      {errorMessage && (
        <p style={{ color: "red", textAlign: "center" }}>{errorMessage}</p>
      )}
      <form onSubmit={handleSearch} style={{ textAlign: "center" }}>
        <input
          type="text"
          placeholder="What do you want to play?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            width: "300px",
            marginRight: "10px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px",
            borderRadius: "10px",
            backgroundColor: "#f0f0f0",
            border: "1px solid #ccc",
          }}
        >
          Search
        </button>
      </form>

      {searchResults.songs.length > 0 && (
        <>
          <h3 style={{ fontSize: "20px", color: "whitesmoke" }}>Songs:</h3>
          <ul style={{ listStyleType: "none", padding: "0" }}>
            {searchResults.songs.map((song) => (
              <li
                key={song.song_id}
                style={{
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <span>
                  {song.title} by {song.artist}
                </span>
                <button
                  onClick={() => handleSongClick(song)}
                  style={{ marginLeft: "auto" }}
                >
                  <FontAwesomeIcon icon={faPlay} />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {searchResults.playlists.length > 0 && (
        <>
          <h3 style={{ fontSize: "20px", color: "whitesmoke" }}>Playlists:</h3>
          <ul style={{ listStyleType: "none", padding: "0" }}>
            {searchResults.playlists.map((playlist) => (
              <li
                key={playlist.playlist_id}
                style={{
                  padding: "10px",
                  display: "flex",
                  alignItems: "center",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <span>{playlist.title}</span>
                <button
                  onClick={() => handlePlaylistClick(playlist.playlist_id)}
                  style={{ marginLeft: "auto" }}
                >
                  View Playlist
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Search;
