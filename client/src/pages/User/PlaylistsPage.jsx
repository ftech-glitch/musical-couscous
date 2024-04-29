import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import UserContext from "../../context/user";
import AddSongToPlaylist from "../../components/AddSongToPlaylist";
import "./PlaylistsPage.css";

const PlaylistsPage = ({ onSongSelect }) => {
  const { playlist_id } = useParams();
  const fetchData = useFetch();
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const [playlistDetails, setPlaylistDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [showAddSong, setShowAddSong] = useState(false);

  const fetchPlaylistDetails = async () => {
    const res = await fetchData(
      `/playlist/${playlist_id}`,
      "GET",
      undefined,
      userCtx.accessToken
    );

    if (res.ok) {
      setPlaylistDetails(res.data.data);
    } else {
      console.error("Error fetching playlist details:", res.data.message);
    }
  };

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

  const deleteSongFromPlaylist = async (song_id) => {
    const res = await fetchData(
      `/song/${song_id}/${playlist_id}/${userCtx.user_id}/remove`,
      "DELETE",
      undefined,
      userCtx.accessToken
    );

    if (res.ok) {
      fetchSongsInPlaylist(); // Refresh after song deletion
    } else {
      setErrorMessage(res.data?.message || "Error removing song from playlist");
    }
  };

  const deletePlaylist = async () => {
    const res = await fetchData(
      `/playlist/${playlist_id}/${userCtx.user_id}`,
      "DELETE",
      undefined,
      userCtx.accessToken
    );

    if (res.ok) {
      navigate(-1); // Go back after deletion
    } else {
      setErrorMessage(res.data?.message || "Error deleting playlist");
    }
  };

  const isPlaylistOwner =
    playlistDetails && playlistDetails.user_id === userCtx.user_id;

  if (!playlist) {
    return <div>Loading playlist...</div>;
  }

  const coverImageUrl = `http://localhost:5001/${playlistDetails.cover}`;

  return (
    <div className="details-container">
      {" "}
      {playlistDetails.cover && (
        <div className="details-cover-container">
          <img
            src={coverImageUrl}
            alt="Playlist Cover"
            className="details-cover"
          />
        </div>
      )}
      <h2 className="details-title">{playlistDetails.title}</h2>
      <p className="details-content">{playlistDetails.content}</p>
      <table className="details-table">
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
          {playlist.songs.map((song) => (
            <tr key={song.song_id}>
              <td>{song.title}</td>
              <td>{song.artist}</td>
              <td>{song.album}</td>
              <td>{song.length}</td>
              <td>
                <button onClick={() => onSongSelect(song)}>Play</button>{" "}
                {isPlaylistOwner && (
                  <button
                    onClick={() => deleteSongFromPlaylist(song.song_id)}
                    style={{ color: "red" }}
                  >
                    Remove
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isPlaylistOwner && (
        <div className="details-buttons">
          <button onClick={() => setShowAddSong((prev) => !prev)}>
            {showAddSong ? "Cancel" : "Add Song"}
          </button>

          {showAddSong && (
            <AddSongToPlaylist fetchSongsInPlaylist={fetchSongsInPlaylist} />
          )}

          <button onClick={deletePlaylist} style={{ color: "red" }}>
            Delete Playlist
          </button>
        </div>
      )}
    </div>
  );
};

export default PlaylistsPage;

// import React, { useEffect, useState, useContext } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import useFetch from "../../hooks/useFetch";
// import UserContext from "../../context/user";
// import AddSongToPlaylist from "../../components/AddSongToPlaylist";

// const PlaylistsPage = ({ onSongSelect }) => {
//   const { playlist_id } = useParams();
//   const [playlist, setPlaylist] = useState(null);
//   const [playlistDetails, setPlaylistDetails] = useState(null);
//   const [errorMessage, setErrorMessage] = useState(null);
//   const fetchData = useFetch();
//   const userCtx = useContext(UserContext);
//   const navigate = useNavigate();
//   const [showAddSong, setShowAddSong] = useState(false);

//   // Fetch playlist details
//   const fetchPlaylistDetails = async () => {
//     const res = await fetchData(
//       `/playlist/${playlist_id}`,
//       "GET",
//       undefined,
//       userCtx.accessToken
//     );

//     if (res.ok) {
//       setPlaylistDetails(res.data.data);
//     } else {
//       console.error("Error fetching playlist details:", res.data.message);
//     }
//   };

//   // Fetch songs in playlist
//   const fetchSongsInPlaylist = async () => {
//     const res = await fetchData(
//       `/song/playlist/${playlist_id}`,
//       "GET",
//       undefined,
//       userCtx.accessToken
//     );

//     if (res.ok) {
//       setPlaylist(res.data);
//     } else {
//       console.error("Error fetching playlist songs:", res.data.message);
//     }
//   };

//   useEffect(() => {
//     fetchPlaylistDetails();
//     fetchSongsInPlaylist();
//   }, [playlist_id]);

//   if (!playlist) {
//     return <div>Loading playlist...</div>;
//   }

//   // delete song from playlist
//   const deleteSongFromPlaylist = async (song_id) => {
//     const res = await fetchData(
//       `/song/${song_id}/${playlist_id}/${userCtx.user_id}/remove`,
//       "DELETE",
//       undefined,
//       userCtx.accessToken
//     );

//     if (res.ok) {
//       fetchSongsInPlaylist(); // Refresh the songs in the playlist after deletion
//     } else {
//       setErrorMessage(res.data?.message || "Error removing song from playlist");
//     }
//   };

//   // delete playlist
//   const deletePlaylist = async () => {
//     const res = await fetchData(
//       `/playlist/${playlist_id}/${userCtx.user_id}`,
//       "DELETE",
//       undefined,
//       userCtx.accessToken
//     );

//     if (res.ok) {
//       navigate(-1);
//     } else {
//       setErrorMessage(res.data?.message || "Error deleting playlist");
//     }
//   };

//   const coverImageUrl = `http://localhost:5001/${playlistDetails.cover}`;

//   return (
//     <div>
//       {playlistDetails.cover && (
//         <img
//           src={coverImageUrl}
//           alt="Playlist Cover"
//           style={{ maxWidth: "30%" }}
//         />
//       )}
//       <h2>{playlistDetails.title}</h2>
//       <h6>{playlistDetails.content}</h6>

//       <br />
//       <div>
//         <table>
//           <thead>
//             <tr>
//               <th>Title</th>
//               <th>Artist</th>
//               <th>Album</th>
//               <th>Length</th>
//               <th></th>
//             </tr>
//           </thead>
//           <tbody>
//             {playlist.songs &&
//               playlist.songs.map((song) => (
//                 <tr key={song.song_id}>
//                   <td>{song.title}</td>
//                   <td>{song.artist}</td>
//                   <td>{song.album}</td>
//                   <td>{song.length}</td>
//                   <td>
//                     <button onClick={() => onSongSelect(song)}>Play</button>
//                     <button
//                       onClick={() => deleteSongFromPlaylist(song.song_id)}
//                       style={{ color: "red" }}
//                     >
//                       Remove
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//           </tbody>
//         </table>
//       </div>

//       <button
//         onClick={() => setShowAddSong((prev) => !prev)} // Toggle visibility
//       >
//         {showAddSong ? "Cancel" : "Add Song"}
//       </button>
//       {showAddSong && (
//         <AddSongToPlaylist fetchSongsInPlaylist={fetchSongsInPlaylist} />
//       )}
//       <button onClick={deletePlaylist} style={{ color: "red" }}>
//         Delete Playlist
//       </button>
//     </div>
//   );
// };

// export default PlaylistsPage;
