import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import UserContext from "../../context/user";
import "./Albums.css";

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  const fetchAlbumsByArtist = async () => {
    const res = await fetchData(
      `/album/artist/${userCtx.artist_id}`,
      "GET",
      undefined,
      userCtx.accessToken
    );

    if (res.ok) {
      setAlbums(res.data.data || []);
    } else {
      console.error("Error fetching albums:", res.data.message);
    }
  };

  useEffect(() => {
    fetchAlbumsByArtist();
  }, [userCtx.artist_id]);

  return (
    <div className="container">
      <h2>Your Albums</h2>
      <div className="albums-cards">
        {albums.map((album) => (
          <div key={album.album_id} className="album-card">
            <Link to={`/album/${album.album_id}`} className="album-link">
              {album.cover && (
                <img
                  src={`http://localhost:5001/${album.cover}`}
                  alt={`Cover of ${album.title}`}
                  className="album-cover"
                />
              )}
              <br />
              <div className="album-title">{album.title}</div>
            </Link>
          </div>
        ))}
      </div>
      <br />
      <button
        className="create-album-btn"
        onClick={() => navigate("/album/new")}
      >
        Create New Album
      </button>
    </div>
  );
};

export default Albums;
