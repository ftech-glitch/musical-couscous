import React, { useState, useContext } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

const PlaylistForm = ({ playlist = {}, onSave }) => {
  const [title, setTitle] = useState(playlist.title || "");
  const [content, setContent] = useState(playlist.content || "");
  const [cover, setCover] = useState(null);
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);

  const createPlaylist = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (cover) {
      formData.append("cover", cover);
    }

    const endpoint = `/playlist/${userCtx.user_id}`;

    const res = await fetchData(
      endpoint,
      "POST",
      formData,
      userCtx.accessToken
    );

    if (res.ok) {
      onSave();
    } else {
      console.error("Error saving playlist:", res.data?.message);
    }
  };

  return (
    <form onSubmit={createPlaylist}>
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
      <button type="submit">Create</button>
    </form>
  );
};

export default PlaylistForm;
