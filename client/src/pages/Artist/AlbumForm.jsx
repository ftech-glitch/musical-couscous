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

const AlbumForm = ({ onSave }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  const createAlbum = async (event) => {
    event.preventDefault();

    if (title.trim() === "") {
      setErrorMessage("Title is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (cover) {
      formData.append("cover", cover);
    }

    try {
      const res = await fetchData(
        `/album/${userCtx.artist_id}`,
        "POST",
        formData,
        userCtx.accessToken
      );

      if (res.ok) {
        setErrorMessage(null);
        setTitle("");
        setContent("");
        setCover(null);
        if (onSave) {
          onSave();
        }
        navigate("/albums");
      } else {
        setErrorMessage(res.data?.message || "Error creating album");
      }
    } catch (error) {
      setErrorMessage("Error creating album");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={createAlbum}
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
        Create Album
      </Typography>
      {errorMessage && (
        <Snackbar
          open={!!errorMessage}
          autoHideDuration={6000}
          onClose={() => setErrorMessage(null)}
        >
          <Alert onClose={() => setErrorMessage(null)} severity="error">
            {errorMessage}
          </Alert>
        </Snackbar>
      )}
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
        Create Album
      </Button>
    </Box>
  );
};

export default AlbumForm;
