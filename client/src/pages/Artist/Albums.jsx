import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import UserContext from "../../context/user";

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
    <div>
      <h2>Your Albums</h2>
      <ul>
        {albums.map((album) => (
          <li key={album.album_id}>
            <Link to={`/album/${album.album_id}`}>{album.title}</Link>{" "}
          </li>
        ))}
      </ul>
      <button onClick={() => navigate("/album/new")}>Create New Album</button>{" "}
    </div>
  );
};

export default Albums;
