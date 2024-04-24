import React, { useEffect, useState } from "react";
import SongCard from "../components/SongCard";

const Songs = () => {
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch("/api/songs");
        const data = await response.json();
        setSongs(data.data || []);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    };

    fetchSongs();
  }, []);

  return (
    <div className="songs-page">
      <h1>All Songs</h1>
      {songs.length === 0 ? (
        <p>No songs found</p>
      ) : (
        <div className="songs-list">
          {songs.map((song) => (
            <SongCard key={song.song_id} song={song} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Songs;
