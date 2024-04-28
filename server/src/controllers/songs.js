const pool = require("../db/db");
const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");

// get all songs
const getAllSongs = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM songs");
    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching songs" });
  }
};

// get song by id
const getSongById = async (req, res) => {
  const { id } = req.params;

  try {
    const song = await pool.query("SELECT * FROM songs WHERE song_id = $1", [
      id,
    ]);

    if (song.rowCount === 0) {
      return res.status(404).json({ message: "Song not found" });
    }

    res.status(200).json({ data: song.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching song" });
  }
};

// get songs in an album
const getSongsInAlbum = async (req, res) => {
  const { album_id } = req.params;

  try {
    // Check if the album exists
    const albumCheck = await pool.query(
      "SELECT * FROM albums WHERE album_id = $1",
      [album_id]
    );

    if (albumCheck.rowCount === 0) {
      return res.status(404).json({
        status: "error",
        message: "Album not found",
      });
    }

    // Fetch songs related to the album
    const songs = await pool.query("SELECT * FROM songs WHERE album_id = $1", [
      album_id,
    ]);

    const result = await pool.query(
      "SELECT song_id, title, artist, album, length FROM songs WHERE album_id = $1",
      [album_id]
    );

    res.status(200).json({
      status: "success",
      songs: result.rows,
      total: songs.rowCount,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: "error",
      message: "Error fetching songs from album",
    });
  }
};

// get songs in a playlist
const getSongsInPlaylist = async (req, res) => {
  const { playlist_id } = req.params;

  try {
    // Check if the playlist exists
    const playlistCheck = await pool.query(
      "SELECT * FROM playlists WHERE playlist_id = $1",
      [playlist_id]
    );

    if (playlistCheck.rowCount === 0) {
      return res.status(404).json({
        status: "error",
        message: "Playlist not found",
      });
    }

    // Fetch songs related to the playlist
    const songs = await pool.query(
      "SELECT * FROM songs WHERE playlist_id = $1",
      [playlist_id]
    );

    const result = await pool.query(
      "SELECT song_id, title, artist, album, length FROM songs WHERE playlist_id = $1",
      [playlist_id]
    );

    res.status(200).json({
      status: "success",
      songs: result.rows,
      total: songs.rowCount,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: "error",
      message: "Error fetching songs from playlist",
    });
  }
};

// create a song
const createSong = async (req, res) => {
  const { album_id, playlist_id } = req.params;
  const { title, artist, album, genre, length, details } = req.body;

  // Check if the audio file is provided
  const audioFile = req.file;
  const relativeAudioPath = `audio/${audioFile.filename}`;

  if (!audioFile) {
    return res.status(400).json({ message: "No audio file uploaded" });
  }

  try {
    let albumName = album;
    let artistName = artist;

    if (album_id) {
      // Fetch album details from the database to get album name and artist
      const albumResult = await pool.query(
        "SELECT albums.title AS album_name, artists.username AS artist_name FROM albums JOIN artists ON albums.artist_id = artists.artist_id WHERE albums.album_id = $1",
        [album_id]
      );

      if (albumResult.rowCount === 0) {
        return res
          .status(404)
          .json({ status: "error", message: "Album not found" });
      }

      albumName = albumResult.rows[0].album_name;
      artistName = albumResult.rows[0].artist_name;
    }

    // Insert the new song into the songs table
    const result = await pool.query(
      "INSERT INTO songs (album_id, playlist_id, title, artist, album, genre, length, details, audio_file) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *",
      [
        album_id,
        playlist_id || null,
        title,
        artistName,
        albumName || null,
        genre,
        length || null,
        details || null,
        relativeAudioPath,
      ]
    );

    const newSong = result.rows[0];

    res.status(201).json({
      status: "success",
      message: "Song created successfully",
      song: newSong,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "error", message: "Error creating song" });
  }
};
// const createSong = async (req, res) => {
//   const { album_id, playlist_id } = req.params;
//   const { title, artist, album, genre, length, details } = req.body;

//   try {
//     let albumName = album;
//     let artistName = artist;

//     if (album_id) {
//       // Fetch album details from the database to get album name and artist
//       const albumResult = await pool.query(
//         "SELECT albums.title AS album_name, artists.username AS artist_name FROM albums JOIN artists ON albums.artist_id = artists.artist_id WHERE albums.album_id = $1",
//         [album_id]
//       );

//       if (albumResult.rowCount === 0) {
//         return res
//           .status(404)
//           .json({ status: "error", message: "Album not found" });
//       }

//       albumName = albumResult.rows[0].album_name;
//       artistName = albumResult.rows[0].artist_name;
//     }

//     // Insert the new song into the songs table
//     const result = await pool.query(
//       "INSERT INTO songs (album_id, playlist_id, title, artist, album, genre, length, details) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
//       [
//         album_id,
//         playlist_id || null,
//         title,
//         artistName,
//         albumName || null,
//         genre,
//         length || null,
//         details || null,
//       ]
//     );

//     const newSong = result.rows[0];

//     res.status(201).json({
//       status: "success",
//       message: "Song created successfully",
//       song: newSong,
//     });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ status: "error", message: "Error creating song" });
//   }
// };

// validate song input with Joi
const validateSong = (song) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    artist: Joi.string().allow(""),
    album: Joi.string().allow(""),
    genre: Joi.string().allow(""),
    length: Joi.string().allow(""),
    details: Joi.string().allow(""),
  });
  return schema.validate(song);
};

// edit song
const editSong = async (req, res) => {
  const { song_id, album_id, artist_id } = req.params;
  const { title, genre, length, details } = req.body;

  const { error, value } = validateSong({ title, genre, length, details });
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    // Check if an audio file is provided for updating
    const audioFile = req.file;
    const relativeAudioPath = `audio/${audioFile.filename}`;

    let updateQuery;
    let updateValues;

    if (audioFile) {
      // If an audio file is provided, include it in the update
      updateQuery =
        "UPDATE songs SET title = $1, genre = $2, length = $3, details = $4, audio_file = $5 WHERE song_id = $6 RETURNING *";
      updateValues = [
        title,
        genre,
        length,
        details,
        relativeAudioPath,
        song_id,
      ];
    } else {
      // Otherwise, update without changing the audio file
      updateQuery =
        "UPDATE songs SET title = $1, genre = $2, length = $3, details = $4 WHERE song_id = $5 RETURNING *";
      updateValues = [title, genre, length, details, song_id];
    }

    const result = await pool.query(updateQuery, updateValues);

    res
      .status(200)
      .json({ data: result.rows[0], message: "Song updated successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error updating song" });
  }
};
// const editSong = async (req, res) => {
//   const { error, value } = validateSong(req.body);
//   if (error) {
//     return res.status(400).json({ message: error.details[0].message });
//   }

//   const { song_id, album_id, artist_id } = req.params;
//   const { title, genre, length, details } = value;

//   try {
//     // Verify the song belongs to the album of the specified artist
//     const songCheck = await pool.query(
//       "SELECT songs.song_id FROM songs JOIN albums ON songs.album_id = albums.album_id WHERE songs.song_id = $1 AND albums.artist_id = $2",
//       [song_id, artist_id]
//     );

//     if (songCheck.rowCount === 0) {
//       return res
//         .status(403)
//         .json({ message: "Artist doesn't have access to edit this song!" });
//     }

//     const result = await pool.query(
//       "UPDATE songs SET title = $1, genre = $2, length = $3, details = $4 WHERE song_id = $5 RETURNING *",
//       [title, genre, length, details, song_id]
//     );

//     res.status(200).json({ data: result.rows[0], message: "Song updated" });
//   } catch (error) {
//     console.error(error.message);
//     res.status(500).json({ message: "Error updating song" });
//   }
// };

// delete song
const deleteSong = async (req, res) => {
  const { song_id, album_id, artist_id } = req.params;

  try {
    // Verify the song belongs to the album of the specified artist
    const songCheck = await pool.query(
      "SELECT songs.song_id FROM songs JOIN albums ON songs.album_id = albums.album_id WHERE songs.song_id = $1 AND albums.artist_id = $2",
      [song_id, artist_id]
    );

    if (songCheck.rowCount === 0) {
      return res
        .status(403)
        .json({ message: "Artist doesn't have access to delete this song!" });
    }

    await pool.query("DELETE FROM songs WHERE song_id = $1", [song_id]);

    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error deleting song" });
  }
};

module.exports = {
  getAllSongs,
  getSongById,
  createSong,
  getSongsInAlbum,
  getSongsInPlaylist,
  editSong,
  deleteSong,
};
