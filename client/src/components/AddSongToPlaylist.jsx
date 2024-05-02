import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { TextField, Button, Typography, Box } from "@mui/material";

const AddSongToPlaylistPage = ({ fetchSongsInPlaylist }) => {
  const { playlist_id } = useParams();
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);

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
      `/song//${selectedSong}/${playlist_id}/${userCtx.user_id}/add`,
      "POST",
      undefined,
      userCtx.accessToken
    );

    if (res.ok) {
      fetchSongsInPlaylist(); // refresh songs in playlist
      fetchSongs(); // refresh songs in music player
    } else {
      setErrorMessage(res.data?.message || "Error adding song to playlist");
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: "#333",
        borderRadius: 2,
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
        color: "whitesmoke",
        fontFamily: "Courier New, monospace",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Add Song to Playlist
      </Typography>

      <Box mb={2}>
        <TextField
          select
          fullWidth
          label="Select a Song"
          value={selectedSong}
          onChange={(e) => setSelectedSong(e.target.value)}
          sx={{ backgroundColor: "whitesmoke", color: "#333" }}
          SelectProps={{
            native: true,
          }}
        >
          <option value="">Select a song</option>
          {songs.map((song) => (
            <option key={song.song_id} value={song.song_id}>
              {song.title} by {song.artist}
            </option>
          ))}
        </TextField>
      </Box>

      <Button
        variant="contained"
        onClick={handleAddSongToPlaylist}
        sx={{
          background: "linear-gradient(to right, #444, #222)",
          color: "whitesmoke",
          "&:hover": {
            background: "linear-gradient(to right, #666, #444)",
          },
        }}
      >
        Add Song
      </Button>
    </Box>
  );
};

export default AddSongToPlaylistPage;
