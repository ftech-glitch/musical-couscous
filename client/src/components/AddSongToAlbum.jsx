import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { TextField, Button, Typography, Box } from "@mui/material";

const AddSongToAlbum = ({ fetchSongsInAlbum }) => {
  const { album_id } = useParams();
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [length, setLength] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [songs, setSongs] = useState([]);

  const fetchSongs = async () => {
    const res = await fetchData("/song", "GET", undefined, userCtx.accessToken);

    if (res.ok) {
      setSongs(res.data.data || []);
    } else {
      setErrorMessage("Error fetching songs");
    }
  };

  const handleAddSong = async (event) => {
    event.preventDefault();

    if (title.trim() === "") {
      setErrorMessage("Title is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("genre", genre || ""); // (optional)
    formData.append("length", length || ""); // (optional)
    if (audioFile) {
      formData.append("audio", audioFile);
    }
    try {
      const res = await fetchData(
        `/song/:playlist_id/${album_id}/`,
        "POST",
        formData,
        userCtx.accessToken
      );

      if (res.ok) {
        fetchSongsInAlbum();
        fetchSongs();
      } else {
        setErrorMessage(res.data?.message || "Error adding song");
      }
    } catch (error) {
      setErrorMessage("Error adding song");
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
        Add New Song
      </Typography>
      <form onSubmit={handleAddSong}>
        <Box mb={2}>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ backgroundColor: "whitesmoke", color: "#333" }}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Genre"
            variant="outlined"
            fullWidth
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            sx={{ backgroundColor: "whitesmoke", color: "#333" }}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Length"
            variant="outlined"
            fullWidth
            value={length}
            onChange={(e) => setLength(e.target.value)}
            sx={{ backgroundColor: "whitesmoke", color: "#333" }}
          />
        </Box>
        <Box mb={2}>
          <Typography variant="subtitle1">Audio File:</Typography>
          <input
            type="file"
            onChange={(e) => setAudioFile(e.target.files[0])}
          />
        </Box>
        <Button
          variant="contained"
          type="submit"
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
      </form>
    </Box>
  );
};

export default AddSongToAlbum;
