import React, { useState, useEffect, useRef, useContext } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faStepBackward,
  faStepForward,
  faVolumeUp,
  faVolumeDown,
} from "@fortawesome/free-solid-svg-icons";
import "./MusicPlayer.css";

const MusicPlayer = ({ selectedSong }) => {
  const [songs, setSongs] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
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

  // Re-fetch the song list if the access token or the selected song changes
  useEffect(() => {
    fetchSongs(); // Refresh the list of songs
  }, [selectedSong, userCtx.accessToken]);

  // Update the current track based on the selected song and available songs
  useEffect(() => {
    if (selectedSong) {
      const index = songs.findIndex(
        (song) => song.song_id === selectedSong.song_id
      );
      if (index !== -1) {
        setCurrentTrackIndex(index);
        setIsPlaying(true);
      }
    }
  }, [songs, selectedSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
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
    setCurrentTrackIndex((prev) => (prev + 1) % songs.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + songs.length) % songs.length);
    setIsPlaying(true);
  };

  const handleVolumeChange = (event) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentTime = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress(currentTime / duration);
    }
  };

  const handleProgressChange = (event) => {
    const newProgress = parseFloat(event.target.value);
    setProgress(newProgress);
    if (audioRef.current) {
      audioRef.current.currentTime = newProgress * audioRef.current.duration; // Set playback position based on progress
    }
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
    <div className="music-player-container">
      <div className="music-player">
        <div className="music-player-info">
          <p>
            Now Playing: {currentTrack.title} by {currentTrack.artist}
          </p>
        </div>
        <audio
          ref={audioRef}
          src={audioFilePath}
          onEnded={handleNext}
          onTimeUpdate={handleTimeUpdate}
        />
        <div className="music-player-controls">
          <button onClick={handlePrev}>
            <FontAwesomeIcon icon={faStepBackward} />
          </button>
          <button onClick={handlePlayPause} style={{ color: "white" }}>
            <FontAwesomeIcon icon={isPlaying ? faPause : faPlay} />
          </button>
          <button onClick={handleNext}>
            <FontAwesomeIcon icon={faStepForward} />
          </button>
        </div>
        <div className="music-player-slider">
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={progress}
            onChange={handleProgressChange}
            className="progress-slider"
          />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
          <FontAwesomeIcon icon={faVolumeUp} /> {/* Volume icon */}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
