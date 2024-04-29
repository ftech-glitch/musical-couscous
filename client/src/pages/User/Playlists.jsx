import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import UserContext from "../../context/user";
import "./Playlists.css"; // Include custom CSS for styling

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
    <div className="playlists-container">
      <h2>Your Playlists</h2>
      <div className="playlists-cards">
        {" "}
        {playlists.map((playlist) => (
          <div key={playlist.playlist_id} className="playlist-card">
            <Link
              to={`/playlist/${playlist.playlist_id}`}
              className="playlist-link"
            >
              {playlist.cover && (
                <img
                  src={`http://localhost:5001/${playlist.cover}`}
                  alt={`Cover of ${playlist.title}`}
                  className="playlist-cover"
                />
              )}
              <br />
              <br />
              <div className="playlist-title">{playlist.title}</div>
            </Link>
          </div>
        ))}
      </div>
      <br />
      <button
        className="create-playlist-btn"
        onClick={() => navigate("/playlist/new")}
      >
        Create New Playlist
      </button>
    </div>
  );
};

export default Playlists;
