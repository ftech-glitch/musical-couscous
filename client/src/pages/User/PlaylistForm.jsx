import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import UserContext from "../../context/user";
import {
  TextField,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";

const PlaylistForm = ({ onSave }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState(null);
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const createPlaylist = async (event) => {
    event.preventDefault();

    if (title.trim() === "") {
      setSnackbarMessage("Title is required.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (cover) {
      formData.append("cover", cover);
    }

    const res = await fetchData(
      `/playlist/${userCtx.user_id}`,
      "POST",
      formData,
      userCtx.accessToken
    );

    if (res.ok) {
      setSnackbarMessage("Playlist created successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setTitle("");
      setContent("");
      setCover(null);
      if (onSave) {
        onSave();
      }
      navigate("/playlists");
    } else {
      setSnackbarMessage(res.data?.message || "Error creating playlist.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={createPlaylist}
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
        Create Playlist
      </Typography>

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
          label="Content"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{ backgroundColor: "whitesmoke", color: "#333" }}
        />
      </Box>

      <Box mb={2}>
        <Typography variant="subtitle1">Cover Image:</Typography>
        <input type="file" onChange={(e) => setCover(e.target.files[0])} />
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
        Create Playlist
      </Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PlaylistForm;
