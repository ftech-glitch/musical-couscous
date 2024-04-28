const pool = require("../db/db");
const Joi = require("joi");
const { v4: uuidv4 } = require("uuid");

// get all playlists
const getAllPlaylists = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM playlists");
    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching playlists" });
  }
};

// get playlist by id
const getPlaylistById = async (req, res) => {
  const { id } = req.params;

  try {
    const playlist = await pool.query(
      "SELECT * FROM playlists WHERE playlist_id = $1",
      [id]
    );

    if (playlist.rowCount === 0) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    res.status(200).json({ data: playlist.rows[0] });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching playlist" });
  }
};

// get playlists that belongs to user
const getPlaylistsByUser = async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM playlists WHERE user_id = $1",
      [user_id]
    );

    res.status(200).json({ data: result.rows });
  } catch (error) {
    console.error("Error fetching playlists:", error.message);
    res.status(500).json({ message: "Error fetching playlists" });
  }
};

// create playlist
const createPlaylist = async (req, res) => {
  const { user_id } = req.params;
  const { title, content } = req.body;
  let cover = null;

  if (req.file) {
    cover = `playlists/${req.file.filename}`;
  }

  try {
    const result = await pool.query(
      "INSERT INTO playlists (user_id, title, content, cover) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, title, content, cover]
    );
    res.status(201).json({ data: result.rows[0], message: "Playlist created" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error creating playlist" });
  }
};

// delete playlist
const deletePlaylist = async (req, res) => {
  const { playlist_id, user_id } = req.params;

  try {
    // check if playlist belongs to user
    const playlist = await pool.query(
      "SELECT * FROM playlists WHERE playlist_id = $1 AND user_id = $2",
      [playlist_id, user_id]
    );

    if (playlist.rowCount === 0) {
      return res
        .status(403)
        .json({ message: "User doesn't have access to delete!" });
    }

    await pool.query("DELETE FROM playlists WHERE playlist_id = $1", [
      playlist_id,
    ]);

    res.status(200).json({ message: "Playlist deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error deleting playlist" });
  }
};

// Validate Playlist Input with Joi
const validatePlaylist = (playlist) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().allow(""),
    cover: Joi.string().allow(""),
  });
  return schema.validate(playlist);
};

// edit playlist
const editPlaylist = async (req, res) => {
  const { error, value } = validatePlaylist(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { playlist_id, user_id } = req.params;
  const { title, content } = value;

  let cover = value.cover; // Default cover from body

  if (req.file) {
    cover = `playlists/${req.file.filename}`; // Update if new file uploaded
  }

  try {
    // check if playlist belongs to user
    const playlist = await pool.query(
      "SELECT * FROM playlists WHERE playlist_id = $1 AND user_id = $2",
      [playlist_id, user_id]
    );

    if (playlist.rowCount === 0) {
      return res
        .status(403)
        .json({ message: "User doesn't have access to edit!" });
    }

    const result = await pool.query(
      "UPDATE playlists SET title = $1, content = $2, cover = $3 WHERE playlist_id = $4 RETURNING *",
      [title, content, cover, playlist_id]
    );

    res.status(200).json({ data: result.rows[0], message: "Playlist updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error updating playlist" });
  }
};

module.exports = {
  createPlaylist,
  editPlaylist,
  deletePlaylist,
  getAllPlaylists,
  getPlaylistById,
  getPlaylistsByUser,
};
