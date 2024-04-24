import React from "react";

const SongCard = ({ song }) => {
  return (
    <div className="song-card">
      <h4>{song.title}</h4>
      <p>{song.artist}</p>
      <p>{song.album}</p>
      <audio controls src={song.audio_file}></audio>
    </div>
  );
};

export default SongCard;
