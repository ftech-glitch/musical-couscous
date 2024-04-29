import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

const AddSongToAlbum = ({ fetchSongsInAlbum }) => {
  const { album_id } = useParams();
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [length, setLength] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

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
      } else {
        setErrorMessage(res.data?.message || "Error adding song");
      }
    } catch (error) {
      setErrorMessage("Error adding song");
    }
  };

  return (
    <div>
      <h2>Add New Song</h2>
      <form onSubmit={handleAddSong}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Genre:</label>
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
          />
        </div>
        <div>
          <label>Length:</label>
          <input
            type="text"
            value={length}
            onChange={(e) => setLength(e.target.value)}
          />
        </div>
        <div>
          <label>Audio File:</label>
          <input
            type="file"
            onChange={(e) => setAudioFile(e.target.files[0])}
          />
        </div>
        <button type="submit">Add Song</button>
      </form>
    </div>
  );
};

export default AddSongToAlbum;
