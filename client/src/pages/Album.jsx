import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Album = () => {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await fetch("/api/albums");
        const data = await response.json();
        setAlbums(data.data || []);
      } catch (error) {
        console.error("Error fetching albums:", error);
      }
    };

    fetchAlbums();
  }, []);

  return (
    <div className="albums-page">
      <h1>Albums</h1>
      {albums.length === 0 ? (
        <p>No albums found</p>
      ) : (
        <div className="albums-list">
          {albums.map((album) => (
            <div key={album.album_id} className="album-card">
              <Link to={`/albums/${album.album_id}`}>{album.title}</Link>
              <p>Artist: {album.artist}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Album;
