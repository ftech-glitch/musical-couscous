import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import UserContext from "../../context/user";

const PlaylistsPage = ({ onSongSelect }) => {
  const { playlist_id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [playlistDetails, setPlaylistDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  // Fetch playlist details
  const fetchPlaylistDetails = async () => {
    const res = await fetchData(
      `/playlist/${playlist_id}`,
      "GET",
      undefined,
      userCtx.accessToken
    );

    console.log("Fetched playlist details:", res);

    if (res.ok) {
      setPlaylistDetails(res.data.data);
    } else {
      console.error("Error fetching playlist details:", res.data.message);
    }
  };

  // Fetch songs in playlist
  const fetchSongsInPlaylist = async () => {
    const res = await fetchData(
      `/song/playlist/${playlist_id}`,
      "GET",
      undefined,
      userCtx.accessToken
    );

    if (res.ok) {
      setPlaylist(res.data);
    } else {
      console.error("Error fetching playlist songs:", res.data.message);
    }
  };

  useEffect(() => {
    fetchPlaylistDetails();
    fetchSongsInPlaylist();
  }, [playlist_id]);

  if (!playlist) {
    return <div>Loading playlist...</div>;
  }

  const deletePlaylist = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this playlist?"
    );
    if (!confirmDelete) return;

    const res = await fetchData(
      `/playlist/${playlist_id}/${userCtx.user_id}`,
      "DELETE",
      undefined,
      userCtx.accessToken
    );

    if (res.ok) {
      navigate(-1);
    } else {
      setErrorMessage(res.data?.message || "Error deleting playlist");
    }
  };

  const coverImageUrl = `http://localhost:5001/${playlistDetails.cover}`;

  return (
    <div>
      {playlistDetails.cover && (
        <img
          src={coverImageUrl}
          alt="Playlist Cover"
          style={{ maxWidth: "30%" }}
        />
      )}
      <h2>{playlistDetails.title}</h2>
      <h6>{playlistDetails.content}</h6>

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
            {playlist.songs &&
              playlist.songs.map((song) => (
                <tr key={song.song_id}>
                  <td>{song.title}</td>
                  <td>{song.artist}</td>
                  <td>{song.album}</td>
                  <td>{song.length}</td>
                  <td>
                    <button onClick={() => onSongSelect(song)}>Play</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <button onClick={deletePlaylist} style={{ color: "red" }}>
        Delete Playlist
      </button>
    </div>
  );
};

export default PlaylistsPage;
