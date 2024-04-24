import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Playlist = () => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const response = await fetch("/api/playlists"); // Adjust endpoint as needed
        const data = await response.json();
        setPlaylists(data.data || []);
      } catch (error) {
        console.error("Error fetching playlists:", error);
      }
    };

    fetchPlaylists();
  }, []);

  return (
    <div className="playlists-page">
      <h1>Playlists</h1>
      {playlists.length === 0 ? (
        <p>No playlists found</p>
      ) : (
        <div className="playlists-list">
          {playlists.map((playlist) => (
            <div key={playlist.playlist_id} className="playlist-card">
              <Link to={`/playlists/${playlist.playlist_id}`}>
                {playlist.name}
              </Link>
              <p>Number of songs: {playlist.songs?.length || 0}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Playlist;
