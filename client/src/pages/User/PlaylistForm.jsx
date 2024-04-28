import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import UserContext from "../../context/user";

const PlaylistForm = ({ onSave }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  const createPlaylist = async (event) => {
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
        `/playlist/${userCtx.user_id}`,
        "POST",
        formData,
        userCtx.accessToken
      );

      if (res.ok) {
        setErrorMessage(null);
        setTitle("");
        setContent("");
        setCover(null);
        onSave();
      } else {
        setErrorMessage(res.data?.message || "Error creating playlist");
      }
    } catch (error) {
      setErrorMessage("Error creating playlist");
    }
  };

  return (
    <form onSubmit={createPlaylist}>
      <h2>Create Playlist</h2>
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
        <label>Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div>
        <label>Cover Image:</label>
        <input type="file" onChange={(e) => setCover(e.target.files[0])} />
      </div>
      <button type="submit">Create Playlist</button>
    </form>
  );
};

export default PlaylistForm;
