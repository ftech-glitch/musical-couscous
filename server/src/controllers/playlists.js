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
      "SELECT * FROM playlist WHERE playlist_id = $1",
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

// Validate Playlist Input with Joi
const validatePlaylist = (playlist) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().allow(""),
    cover: Joi.string().allow(""),
  });
  return schema.validate(playlist);
};

// create playlist
const createPlaylist = async (req, res) => {
  console.log("req.user:", req.user);
  console.log("req.user.id:", req.user.id);

  const { title, content } = req.body;
  let cover = null;

  if (req.file) {
    cover = `/uploads/${req.file.filename}`;
  }

  try {
    const userId = req.user.id;
    console.log("Inserting playlist with user_id:", userId);

    const result = await pool.query(
      "INSERT INTO playlists (playlist_id, user_id, title, content, cover) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [uuidv4(), userId, title, content, cover]
    );
    res.status(201).json({ data: result.rows[0], message: "Playlist created" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error creating playlist" });
  }
};

// Edit Playlist
const editPlaylist = async (req, res) => {
  const { error, value } = validatePlaylist(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { id } = req.params; // Playlist ID
  const { title, content, cover } = value;

  try {
    const userId = req.user.id;

    // Check if the user has access to edit this playlist
    const playlist = await pool.query(
      "SELECT * FROM playlist WHERE playlist_id = $1 AND user_id = $2",
      [id, userId]
    );

    if (playlist.rowCount === 0) {
      return res
        .status(403)
        .json({ message: "User doesn't have access to edit!" });
    }

    const result = await pool.query(
      "UPDATE playlist SET title = $1, content = $2, cover = $3 WHERE playlist_id = $4 RETURNING *",
      [title, content, cover, id]
    );

    res.status(200).json({ data: result.rows[0], message: "Playlist updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error updating playlist" });
  }
};

// Delete Playlist
const deletePlaylist = async (req, res) => {
  const { id } = req.params; // Playlist ID

  try {
    const userId = req.user.id;

    // Check if the user has access to delete this playlist
    const playlist = await pool.query(
      "SELECT * FROM playlist WHERE playlist_id = $1 AND user_id = $2",
      [id, userId]
    );

    if (playlist.rowCount === 0) {
      return res
        .status(403)
        .json({ message: "User doesn't have access to delete!" });
    }

    await pool.query("DELETE FROM playlist WHERE playlist_id = $1", [id]);

    res.status(200).json({ message: "Playlist deleted" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error deleting playlist" });
  }
};

module.exports = {
  createPlaylist,
  editPlaylist,
  deletePlaylist,
  getAllPlaylists,
  getPlaylistById,
};
