import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import UserContext from "../../context/user";
import AddSongToAlbum from "../../components/AddSongToAlbum";
import "./AlbumsPage.css";
import { faStar as faSolidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AlbumsPage = ({ onSongSelect }) => {
  const { album_id } = useParams();
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();
  const [album, setAlbum] = useState(null);
  const [albumDetails, setAlbumDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showAddSong, setShowAddSong] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

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
      setErrorMessage("Error fetching album details.");
    }
  };

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
      setErrorMessage("Error fetching album songs.");
    }
  };

  const checkIfFavorited = async () => {
    // Endpoint to get all favorite albums for the user/artist
    const favoriteEndpoint =
      userCtx.role === "artist"
        ? `/favorite/artist/${userCtx.artist_id}`
        : `/favorite/user/${userCtx.user_id}`;

    const res = await fetchData(
      favoriteEndpoint,
      "GET",
      undefined,
      userCtx.accessToken
    );

    if (res.ok) {
      const favoriteAlbums = res.data;
      const isFav = favoriteAlbums.some(
        (favAlbum) => favAlbum.album_id === album_id
      );
      setIsFavorited(isFav);
    } else {
      setErrorMessage("Error checking favorite status.");
    }
  };

  const toggleFavorite = async () => {
    const endpoint = isFavorited
      ? userCtx.role === "artist"
        ? `/favorite/artist/${userCtx.artist_id}/${album_id}`
        : `/favorite/user/${userCtx.user_id}/${album_id}`
      : userCtx.role === "artist"
      ? `/favorite/artist/${userCtx.artist_id}/${album_id}`
      : `/favorite/user/${userCtx.user_id}/${album_id}`;

    const method = isFavorited ? "DELETE" : "POST";

    const res = await fetchData(
      endpoint,
      method,
      undefined,
      userCtx.accessToken
    );

    if (res.ok) {
      setIsFavorited(!isFavorited);
    } else {
      setErrorMessage("Error toggling favorite status.");
    }
  };

  useEffect(() => {
    fetchAlbumDetails();
    fetchSongsInAlbum();
    checkIfFavorited();
  }, [album_id]);

  const deleteAlbum = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this album?"
    );
    if (confirmDelete) {
      const res = await fetchData(
        `/album/${album_id}/${userCtx.artist_id}`,
        "DELETE",
        undefined,
        userCtx.accessToken
      );

      if (res.ok) {
        navigate(-1);
      } else {
        setErrorMessage("Error deleting album.");
      }
    }
  };

  const deleteSongFromAlbum = async (song_id) => {
    const res = await fetchData(
      `/song/${song_id}/${album_id}/${userCtx.artist_id}`,
      "DELETE",
      undefined,
      userCtx.accessToken
    );

    if (res.ok) {
      fetchSongsInAlbum();
    } else {
      setErrorMessage("Error deleting song from album.");
    }
  };

  const isAlbumOwner =
    albumDetails && albumDetails.artist_id === userCtx.artist_id;

  if (!album) {
    return <div>Loading album...</div>;
  }

  const coverImageUrl = `http://localhost:5001/${albumDetails.cover}`;

  return (
    <div className="details-container">
      {albumDetails.cover && (
        <img src={coverImageUrl} alt="Album Cover" className="details-cover" />
      )}
      <h2 className="details-title">{albumDetails.title}</h2>
      <h6 className="details-content">{albumDetails.content}</h6>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <div className="favorite-button-container">
        <button
          onClick={toggleFavorite}
          style={{ background: "none", border: "none" }}
        >
          <FontAwesomeIcon
            icon={isFavorited ? faSolidStar : faRegularStar}
            style={{
              color: isFavorited ? "#FFD700" : "gray",
              fontSize: "24px",
            }}
          />
        </button>
      </div>

      <table className="details-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Artist</th>
            <th>Album</th>
            <th>Length</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {album.songs.map((song) => (
            <tr key={song.song_id}>
              <td>{song.title}</td>
              <td>{song.artist}</td>
              <td>{song.album}</td>
              <td>{song.length}</td>
              <td>
                <button onClick={() => onSongSelect(song)}>Play</button>
                {isAlbumOwner && (
                  <button
                    onClick={() => deleteSongFromAlbum(song.song_id)}
                    style={{ color: "red" }}
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isAlbumOwner && (
        <div className="details-buttons">
          <button onClick={() => setShowAddSong((prev) => !prev)}>
            {showAddSong ? "Cancel" : "Add Song"}
          </button>
          {showAddSong && (
            <AddSongToAlbum fetchSongsInAlbum={fetchSongsInAlbum} />
          )}
          <button onClick={() => navigate(`/album/edit/${album_id}`)}>
            Edit Album
          </button>
          <button onClick={deleteAlbum} style={{ color: "red" }}>
            Delete Album
          </button>
        </div>
      )}
    </div>
  );
};

export default AlbumsPage;
