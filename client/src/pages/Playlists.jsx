import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);

  console.log("User ID", userCtx.user_id);

  const fetchPlaylistsByUser = async () => {
    const res = await fetchData(
      `/playlist/user/${userCtx.user_id}`,
      "GET",
      undefined,
      userCtx.accessToken
    );
    if (res.ok) {
      setPlaylists(res.data.data || []);
    } else {
      console.error("Error fetching playlists:", res.data.message);
    }
  };

  useEffect(() => {
    fetchPlaylistsByUser();
  }, [userCtx.user_id]); // re-fetch if user ID changes

  return (
    <div>
      <h2>Your Playlists</h2>
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.playlist_id}>
            <Link to={`/playlist/${playlist.playlist_id}`}>
              {playlist.title}
            </Link>
          </li>
        ))}
      </ul>
      <Link to="/playlist/new">Create New Playlist</Link>
    </div>
  );
};

export default Playlists;
