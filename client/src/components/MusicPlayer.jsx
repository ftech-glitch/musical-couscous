import React, { useState, useEffect, useRef, useContext } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

const MusicPlayer = () => {
  const [songs, setSongs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);

  const fetchSongs = async () => {
    const res = await fetchData("/song", "GET", undefined, userCtx.accessToken);

    if (res.ok) {
      setSongs(res.data.data || []);
    } else {
      console.error("Error fetching songs:", res.data);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume; // Adjust volume
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex, volume]);

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev); // Toggle play/pause
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % songs.length); // Next track
    setIsPlaying(true); // Auto-play when switching tracks
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + songs.length) % songs.length); // Previous track
    setIsPlaying(true);
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume); // Change volume
  };

  if (songs.length === 0) {
    return <div>Loading songs...</div>;
  }

  const currentTrack = songs[currentTrackIndex];

  if (!currentTrack) {
    return <div>No songs found.</div>;
  }

  const audioFilePath = `http://localhost:5001/${currentTrack.audio_file}`;

  return (
    <div>
      <h2>Music Player</h2>
      <p>
        Now Playing: {currentTrack.title} by {currentTrack.artist}{" "}
      </p>
      <audio ref={audioRef} src={audioFilePath} />
      <button onClick={handlePrev}>Previous</button>
      <button onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
      <button onClick={handleNext}>Next</button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={handleVolumeChange}
      />
    </div>
  );
};

export default MusicPlayer;
