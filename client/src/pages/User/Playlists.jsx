import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import UserContext from "../../context/user";

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

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
          <li
            key={playlist.playlist_id}
            style={{ display: "flex", alignItems: "center" }}
          >
            {playlist.cover && (
              <img
                src={`http://localhost:5001/${playlist.cover}`}
                alt={`Cover of ${playlist.title}`}
                style={{ width: "50px", height: "50px", marginRight: "10px" }}
              />
            )}
            <Link to={`/playlist/${playlist.playlist_id}`}>
              {playlist.title}
            </Link>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate("/playlist/new")}>
        Create new playlist
      </button>
    </div>
  );
};

export default Playlists;
