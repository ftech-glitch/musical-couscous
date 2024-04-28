import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import UserContext from "../../context/user";

const AlbumsPage = ({ onSongSelect }) => {
  const { album_id } = useParams();
  const [album, setAlbum] = useState(null);
  const [albumDetails, setAlbumDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  // Fetch album details
  const fetchAlbumDetails = async () => {
    const res = await fetchData(
      `/album/${album_id}`,
      "GET",
      undefined,
      userCtx.accessToken
    );

    if (res.ok) {
      setAlbumDetails(res.data.data);
    } else {
      setErrorMessage(res.data?.message || "Error fetching album details");
      console.error("Error fetching album details:", res.data?.message);
    }
  };

  // Fetch songs in album
  const fetchSongsInAlbum = async () => {
    const res = await fetchData(
      `/song/album/${album_id}`,
      "GET",
      undefined,
      userCtx.accessToken
    );

    if (res.ok) {
      setAlbum(res.data);
    } else {
      console.error("Error fetching playlist songs:", res.data.message);
    }
  };

  useEffect(() => {
    fetchAlbumDetails();
    fetchSongsInAlbum();
  }, [album_id]);

  // Delete the album
  const deleteAlbum = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this album?"
    );
    if (!confirmDelete) return;

    const res = await fetchData(
      `/album/${album_id}/${userCtx.artist_id}`,
      "DELETE",
      undefined,
      userCtx.accessToken
    );

    if (res.ok) {
      navigate(-1); // navigate back to home after successful deletion
    } else {
      setErrorMessage(res.data?.message || "Error deleting album");
    }
  };

  if (!album) {
    return <div>Loading album...</div>;
  }

  const coverImageUrl = `http://localhost:5001/${albumDetails.cover}`;

  return (
    <div>
      {albumDetails.cover && (
        <img
          src={coverImageUrl}
          alt="Album Cover"
          style={{ maxWidth: "30%" }}
        />
      )}
      <h2>{albumDetails.title}</h2>
      <h6>{albumDetails.content}</h6>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <br />
      <div>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Artist</th>
              <th>Album</th>
              <th>Length</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {album.songs &&
              album.songs.map((song) => (
                <tr key={song.song_id}>
                  <td>{song.title}</td>
                  <td>{song.artist}</td>
                  <td>{song.album}</td>
                  <td>{song.length}</td>
                  <td>
                    <button onClick={() => onSongSelect(song)}>Play</button>{" "}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <button onClick={deleteAlbum} style={{ color: "red" }}>
        Delete Album
      </button>{" "}
    </div>
  );
};

export default AlbumsPage;
