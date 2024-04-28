import React, { useEffect, useState, useContext } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

function PlaylistsPage({ playlistId }) {
  const userCtx = useContext(UserContext);
  const fetchData = useFetch();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getSongsInPlaylist = async () => {
    try {
      setLoading(true);
      const res = await fetchData(
        `/playlist/${playlistId}`,
        "GET",
        undefined,
        userCtx.accessToken
      );

      if (res.ok) {
        setSongs(res.data.songs);
      } else {
        setError("Failed to fetch songs in playlist");
      }
    } catch (err) {
      setError("Error fetching songs in playlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSongsInPlaylist();
  }, [playlistId]); // Fetch songs when playlistId changes

  if (loading) {
    return <div>Loading songs...</div>;
  }

  if (error) {
    return <div>{error}</div>; // Display error if there's an issue
  }

  return (
    <div>
      <h2>Songs in Playlist</h2>
      {songs.length === 0 ? (
        <p>No songs found in this playlist.</p>
      ) : (
        <ul>
          {songs.map((song) => (
            <li key={song.song_id}>
              {song.title} by {song.artist}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default PlaylistsPage;
