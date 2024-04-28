import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import MusicPlayer from "../components/MusicPlayer";

const PlaylistsPage = ({ onSongSelect }) => {
  const { playlist_id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);

  const fetchSongsInPlaylist = async () => {
    const res = await fetchData(
      `/song/playlist/${playlist_id}`,
      "GET",
      undefined,
      userCtx.accessToken
    );

    if (res.ok) {
      setPlaylist(res.data || null);
    } else {
      console.error("Error fetching playlist:", res.data.message);
    }
  };

  useEffect(() => {
    fetchSongsInPlaylist();
  }, [playlist_id]);

  if (!playlist) {
    return <div>Loading playlist...</div>;
  }

  return (
    <div>
      <h2>{playlist.title}</h2>
      <p>{playlist.content}</p>
      <ul>
        {playlist.songs &&
          playlist.songs.map((song) => (
            <li key={song.song_id}>
              {song.title}
              <button onClick={() => onSongSelect(song)}>Play</button>{" "}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default PlaylistsPage;
