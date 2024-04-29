import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import UserContext from "../../context/user";
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";

const AlbumEdit = () => {
  const { album_id } = useParams();
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  const [albumDetails, setAlbumDetails] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  console.log("fetch album_id", album_id);

  // Fetch album details
  const fetchAlbumDetails = async () => {
    const res = await fetchData(
      `/album/${album_id}`,
      "GET",
      undefined,
      userCtx.accessToken
    );

    console.log("res", res);

    if (res.ok) {
      setAlbumDetails(res.data.data);
      setTitle(res.data.data.title);
      setContent(res.data.data.content || "");
    } else {
      setErrorMessage("Error fetching album details");
    }
  };

  useEffect(() => {
    fetchAlbumDetails();
  }, [album_id]);

  console.log("fetch album details", albumDetails);

  const handleCoverChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      // Only update if a new file is selected
      setCover(e.target.files[0]);
    }
  };

  const handleUpdateAlbum = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    // Append the existing cover if no new file is selected
    if (cover instanceof File) {
      formData.append("cover", cover); // If it's a new file
    } else if (albumDetails.cover) {
      // Keep existing cover
      formData.append("cover", albumDetails.cover);
    }

    try {
      const res = await fetchData(
        `/album/${album_id}/${userCtx.artist_id}`,
        "PUT",
        formData,
        userCtx.accessToken
      );

      if (res.ok) {
        navigate(-1);
      } else {
        setErrorMessage("Error updating album");
      }
    } catch (error) {
      setErrorMessage("Error updating album");
    }
  };

  if (!albumDetails) {
    return <div>Loading album details...</div>;
  }

  return (
    <Box
      component="form"
      onSubmit={handleUpdateAlbum}
      sx={{
        padding: 3,
        backgroundColor: "#333",
        borderRadius: 2,
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
        color: "whitesmoke",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Edit Album
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
        <Typography variant="subtitle1">Change Album Cover:</Typography>
        <input type="file" onChange={handleCoverChange} />
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
        Update Album
      </Button>
    </Box>
  );
};

export default AlbumEdit;
