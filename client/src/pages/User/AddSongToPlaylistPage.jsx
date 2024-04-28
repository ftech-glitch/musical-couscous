import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import UserContext from "../../context/user";

const AddSongToPlaylistPage = () => {
  const { playlist_id } = useParams();
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  const fetchSongs = async () => {
    const res = await fetchData("/song", "GET", undefined, userCtx.accessToken);

    if (res.ok) {
      setSongs(res.data.data || []);
    } else {
      setErrorMessage("Error fetching songs");
    }
  };

  const handleAddSongToPlaylist = async () => {
    if (!selectedSong) {
      setErrorMessage("Please select a song.");
      return;
    }

    const res = await fetchData(
      `/song//${selectedSong}/${playlist_id}/add`,
      "POST",
      undefined,
      userCtx.accessToken
    );

    if (res.ok) {
      navigate(`/playlist/${playlist_id}`); // Redirect back to the playlist page
    } else {
      setErrorMessage(res.data?.message || "Error adding song to playlist");
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <div>
      <h2>Add Song to Playlist</h2>
      <div>
        <select
          value={selectedSong}
          onChange={(e) => setSelectedSong(e.target.value)}
        >
          <option value="">Select a song</option>
          {songs.map((song) => (
            <option key={song.song_id} value={song.song_id}>
              {song.title} by {song.artist}
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleAddSongToPlaylist}>Add Song</button>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default AddSongToPlaylistPage;
